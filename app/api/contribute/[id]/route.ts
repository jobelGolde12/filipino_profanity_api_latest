import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";

const ADMIN_EMAIL = "jobelgolde43@gmail.com";
const ADMIN_PASS = "My_api_pass123";

function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) return false;
  const decoded = atob(authHeader.split(" ")[1]);
  const [email, password] = decoded.split(":");
  return email === ADMIN_EMAIL && password === ADMIN_PASS;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const submissionId = parseInt(id, 10);

    if (isNaN(submissionId)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !["approved", "denied"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status must be 'approved' or 'denied'" },
        { status: 400 }
      );
    }

    const result = await db.execute({
      sql: "SELECT id, word, language, region FROM word_submissions WHERE id = ?",
      args: [submissionId],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    const submission = result.rows[0];

    if (status === "approved") {
      await db.execute({
        sql: "INSERT INTO profanity (word, language, region, severity) VALUES (?, ?, ?, ?)",
        args: [
          submission.word as string,
          submission.language as string,
          submission.region as string | null,
          "medium",
        ],
      });
    }

    await db.execute({
      sql: "UPDATE word_submissions SET status = ? WHERE id = ?",
      args: [status, submissionId],
    });

    return NextResponse.json({
      success: true,
      message: status === "approved" ? "Word approved and added" : "Submission denied and removed",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process submission" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const submissionId = parseInt(id, 10);

    if (isNaN(submissionId)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID" },
        { status: 400 }
      );
    }

    const result = await db.execute({
      sql: "DELETE FROM word_submissions WHERE id = ?",
      args: [submissionId],
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Submission deleted" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}
