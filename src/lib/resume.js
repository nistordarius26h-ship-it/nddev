import { jsPDF } from "jspdf";
import { RESUME } from "./resumeData";

export function downloadResume() {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;
  let y = 56;

  const ensure = (need) => {
    if (y + need > H - M) {
      doc.addPage();
      y = M;
    }
  };

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 15, 15);
  doc.text(RESUME.name.toUpperCase(), M, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(RESUME.role, M, y);
  y += 16;

  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text(RESUME.email, M, y);
  doc.text(RESUME.github, M, y + 10);
  doc.text(RESUME.linkedin, M, y + 20);
  y += 32;

  doc.setDrawColor(210, 210, 210);
  doc.line(M, y, W - M, y);
  y += 22;

  const section = (title) => {
    ensure(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text(title, M, y);
    y += 6;
    doc.setDrawColor(225, 225, 225);
    doc.line(M, y, W - M, y);
    y += 16;
  };

  const para = (text, size = 9, color = [70, 70, 70]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, W - M * 2);
    lines.forEach((ln) => {
      ensure(size + 4);
      doc.text(ln, M, y);
      y += size + 4;
    });
  };

  // Summary
  section("SUMMARY");
  para(RESUME.summary, 9, [70, 70, 70]);
  y += 8;

  // Skills
  section("SKILLS");
  RESUME.skills.forEach((g) => {
    ensure(24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    doc.text(g.group.toUpperCase(), M, y);
    y += 12;
    para(g.items.join("  ·  "), 8, [90, 90, 90]);
    y += 6;
  });
  y += 6;

  // Projects
  section("PROJECTS");
  RESUME.projects.forEach((p) => {
    ensure(34);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    doc.text(p.name, M, y);
    y += 12;
    para(p.desc, 8, [90, 90, 90]);
    ensure(14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(p.url, M, y);
    y += 18;
  });
  y += 4;

  // Certificates
  section("CERTIFICATES");
  RESUME.certificates.forEach((c) => {
    ensure(22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(`•  ${c.name}`, M, y);
    y += 11;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(130, 130, 130);
    doc.text(c.issuer, M + 12, y);
    y += 15;
  });

  doc.save("Darius_Nistor_Resume.pdf");
}