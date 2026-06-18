import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Serves an uploaded résumé. Access is restricted to:
//  - the student who uploaded it,
//  - the company whose job the application was made to,
//  - an admin.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const resume = await prisma.resume.findUnique({
    where: { id },
    include: { application: { include: { job: true } } },
  });
  if (!resume || !resume.application) {
    return new Response("Not found", { status: 404 });
  }

  const application = resume.application;

  let allowed = false;
  if (session.role === "ADMIN") {
    allowed = true;
  } else if (session.role === "STUDENT") {
    allowed = application.applicantId === session.userId;
  } else if (session.role === "COMPANY") {
    const company = await prisma.companyProfile.findUnique({
      where: { userId: session.userId },
    });
    allowed = Boolean(company && application.job.companyId === company.id);
  }
  if (!allowed) return new Response("Forbidden", { status: 403 });

  // Strip characters that could break the Content-Disposition header.
  const safeName = resume.filename.replace(/[^\w.\- ]/g, "_") || "resume";

  return new Response(Buffer.from(resume.data), {
    headers: {
      "Content-Type": resume.mimeType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${safeName}"`,
      "Content-Length": String(resume.size),
      "Cache-Control": "private, no-store",
    },
  });
}
