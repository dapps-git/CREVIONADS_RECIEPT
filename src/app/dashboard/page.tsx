"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
type PaymentMethod = "Cash" | "UPI" | "Bank Transfer" | "Card";

interface ReceiptData {
    receiptNo: string;
    date: string;
    studentName: string;
    course: string;
    phoneNumber: string;
    paymentFor: string;
    paymentMethod: PaymentMethod;
    transactionId: string;
    receivedBy: string;
    courseFee: string;
    totalAmountPaid: string;
}

const TODAY = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
});

const DEFAULT_DATA: ReceiptData = {
    receiptNo: "0001",
    date: TODAY,
    studentName: "",
    course: "",
    phoneNumber: "",
    paymentFor: "",
    paymentMethod: "Cash",
    transactionId: "",
    receivedBy: "",
    courseFee: "",
    totalAmountPaid: "",
};

const formatCurrency = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "—";
    return `₹${num.toFixed(2)}`;
};

const calculateBalance = (courseFee: string, totalPaid: string) => {
    if (!courseFee) return "";
    const fee = parseFloat(courseFee) || 0;
    const paid = parseFloat(totalPaid) || 0;
    return (fee - paid).toString();
};



// ── SVG Icons ──────────────────────────────────────────────────
const PersonIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
);
const CourseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
    </svg>
);
const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.1 19.79 19.79 0 01.22 2.46 2 2 0 012.22.5h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.64 8a16 16 0 006.37 6.37l.81-.81a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
);
const PayIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
    </svg>
);
const WalletIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5" />
        <circle cx="18" cy="12" r="2" />
    </svg>
);
const HashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" />
        <line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
    </svg>
);
const UserCheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
    </svg>
);
const PinIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);
const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);
const GlobeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
);
const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
);
const PrinterIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
    </svg>
);


// ── Main Component ──────────────────────────────────────────────
export default function ReceiptMaker() {
    const [data, setData] = useState<ReceiptData>(DEFAULT_DATA);
    const receiptRef = useRef<HTMLDivElement>(null);

    const update = useCallback((field: keyof ReceiptData, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handlePrint = () => {
        window.print();
    };
    const router = useRouter();

    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn");

        if (loggedIn !== "true") {
            router.push("/dashboard");
        }
    }, [router]);
    const handleGeneratePDF = async () => {
        const element = receiptRef.current;
        if (!element) return;

        // Add pdf-mode class to remove dashed underlines in generated PDF
        element.classList.add("pdf-mode");

        try {
            // @ts-ignore
            const html2pdf = (await import("html2pdf.js")).default;
            await html2pdf()
                .set({
                    margin: 0,
                    filename: `receipt-${data.receiptNo}.pdf`,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, logging: false },
                    jsPDF: { unit: "px", format: [800, 566], orientation: "landscape" },
                })
                .from(element)
                .save();
        } finally {
            // Remove class to restore underlines in screen preview
            element.classList.remove("pdf-mode");
        }
    };

    const needsTransactionId = data.paymentMethod !== "Cash";

    return (
        <>
            <div className="app-container">
                {/* ── Sidebar / Form Panel ─────────────────────── */}
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <Image
                            src="/image.png"
                            alt="Logo Icon"
                            width={48}
                            height={48}
                            className="sidebar-logo"
                            priority
                            style={{ objectFit: "contain" }}
                        />
                        <h1>Receipt Maker</h1>
                    </div>

                    <div className="sidebar-content">
                        {/* Receipt Info */}
                        <div className="form-section">
                            <p className="section-title">Receipt Info</p>
                            <div className="form-group row">
                                <div className="form-group">
                                    <label htmlFor="receipt-no">Receipt No.</label>
                                    <input
                                        id="receipt-no"
                                        type="text"
                                        value={data.receiptNo}
                                        onChange={(e) => update("receiptNo", e.target.value)}
                                        placeholder="0001"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="receipt-date">Date</label>
                                    <input
                                        id="receipt-date"
                                        type="text"
                                        value={data.date}
                                        onChange={(e) => update("date", e.target.value)}
                                        placeholder="MM/DD/YYYY"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Student Details */}
                        <div className="form-section">
                            <p className="section-title">Student Details</p>
                            <div className="form-group">
                                <label htmlFor="student-name">Student Name</label>
                                <input
                                    id="student-name"
                                    type="text"
                                    value={data.studentName}
                                    onChange={(e) => update("studentName", e.target.value)}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="course">Course</label>
                                <input
                                    id="course"
                                    type="text"
                                    value={data.course}
                                    onChange={(e) => update("course", e.target.value)}
                                    placeholder="e.g. Full Stack Development"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={data.phoneNumber}
                                    onChange={(e) => update("phoneNumber", e.target.value)}
                                    placeholder="e.g. +91 9876543210"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="payment-for">Payment For</label>
                                <input
                                    id="payment-for"
                                    type="text"
                                    value={data.paymentFor}
                                    onChange={(e) => update("paymentFor", e.target.value)}
                                    placeholder="e.g. 1st Installment"
                                />
                            </div>
                        </div>

                        {/* Fees */}
                        <div className="form-section">
                            <p className="section-title">Fee Details</p>
                            <div className="form-group">
                                <label htmlFor="course-fee">Course Fee (₹)</label>
                                <input
                                    id="course-fee"
                                    type="number"
                                    min="0"
                                    value={data.courseFee || ""}
                                    onChange={(e) => update("courseFee", e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="total-amount-paid">Total Amount Paid (₹)</label>
                                <input
                                    id="total-amount-paid"
                                    type="number"
                                    min="0"
                                    value={data.totalAmountPaid || ""}
                                    onChange={(e) => update("totalAmountPaid", e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="balance-amount">Balance Amount</label>
                                <input
                                    id="balance-amount"
                                    type="text"
                                    value={formatCurrency(calculateBalance(data.courseFee || "", data.totalAmountPaid || ""))}
                                    readOnly
                                    disabled
                                    style={{ opacity: 0.7, cursor: "not-allowed" }}
                                />
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="form-section">
                            <p className="section-title">Payment Details</p>
                            <div className="form-group">
                                <label htmlFor="payment-method">Payment Method</label>
                                <select
                                    id="payment-method"
                                    value={data.paymentMethod}
                                    onChange={(e) => update("paymentMethod", e.target.value as PaymentMethod)}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Card">Card</option>
                                </select>
                            </div>
                            {needsTransactionId && (
                                <div className="form-group">
                                    <label htmlFor="transaction-id">Transaction ID</label>
                                    <input
                                        id="transaction-id"
                                        type="text"
                                        value={data.transactionId}
                                        onChange={(e) => update("transactionId", e.target.value)}
                                        placeholder="Enter transaction reference"
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label htmlFor="received-by">Received By</label>
                                <input
                                    id="received-by"
                                    type="text"
                                    value={data.receivedBy}
                                    onChange={(e) => update("receivedBy", e.target.value)}
                                    placeholder="Staff name"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="sidebar-actions">
                        <button id="btn-generate-pdf" className="btn btn-primary" onClick={handleGeneratePDF}>
                            <DownloadIcon />
                            Generate PDF
                        </button>
                        <button id="btn-print" className="btn btn-secondary" onClick={handlePrint}>
                            <PrinterIcon />
                            Print Receipt
                        </button>
                    </div>
                </aside>

                {/* ── Canvas / Preview Panel ───────────────────── */}
                <main className="canvas">
                    <div className="receipt-wrapper" ref={receiptRef}>
                        {/* Header */}
                        <header className="receipt-header">
                            <div className="header-logo-container">
                                <Image
                                    src="/logo.png"
                                    alt="Grevion.ads Logo"
                                    width={320}
                                    height={96}
                                    className="header-logo"
                                    priority
                                    style={{ objectFit: "contain", objectPosition: "left center" }}
                                />
                            </div>

                            <div className="header-contact">
                                <div className="contact-divider" />
                                <div className="contact-info">
                                    <div className="contact-item">
                                        <PinIcon />
                                        <span>1st floor, KPM Arcade, Valanchery, 676552</span>
                                    </div>
                                    <div className="contact-item">
                                        <PhoneIcon />
                                        <span>+91 811 390 8262</span>
                                    </div>
                                    <div className="contact-item">
                                        <MailIcon />
                                        <span>crevionads@gmail.com</span>
                                    </div>
                                    <div className="contact-item">
                                        <GlobeIcon />
                                        <span>www.crevionads.com</span>
                                    </div>
                                </div>
                            </div>

                            {/* Diagonal Graphic — inline colors so html2pdf captures them */}
                            <div className="diagonal-container" aria-hidden="true">
                                <div
                                    className="diagonal-yellow"
                                    style={{ backgroundColor: "#f4be1a" }}
                                />
                                <div
                                    className="diagonal-purple"
                                    style={{ backgroundColor: "#3A025B" }}
                                />
                            </div>
                        </header>

                        {/* Body */}
                        <div className="receipt-body">
                            {/* Title + Meta — title on left, Receipt No/Date box on top right */}
                            <div className="receipt-title-row">
                                <h2 className="receipt-title">Academic Payment Receipt</h2>
                                <div className="receipt-meta-box">
                                    <div className="meta-row">
                                        <div className="meta-label">Receipt No .</div>
                                        <div className="meta-value">{data.receiptNo || "—"}</div>
                                    </div>
                                    <div className="meta-row">
                                        <div className="meta-label">Date</div>
                                        <div className="meta-value">{data.date || "—"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Student Info + Financial Table */}
                            <div className="receipt-details-section">
                                <div className="info-fields">
                                    <div className="info-item">
                                        <span className="info-icon-wrapper"><PersonIcon /></span>
                                        <span className="info-label">Student Name :</span>
                                        <span className="info-value">{data.studentName || ""}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-icon-wrapper"><CourseIcon /></span>
                                        <span className="info-label">Course :</span>
                                        <span className="info-value">{data.course || ""}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-icon-wrapper"><PhoneIcon /></span>
                                        <span className="info-label">Phone Number :</span>
                                        <span className="info-value">{data.phoneNumber || ""}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-icon-wrapper"><PayIcon /></span>
                                        <span className="info-label">Payment For :</span>
                                        <span className="info-value">{data.paymentFor || ""}</span>
                                    </div>
                                </div>

                                <table className="financial-table">
                                    <thead>
                                        <tr>
                                            <th>Description</th>
                                            <th>Amount (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Course Fee</td>
                                            <td>{formatCurrency(data.courseFee)}</td>
                                        </tr>
                                        <tr className="total-row">
                                            <td>Total Amount Paid</td>
                                            <td>{formatCurrency(data.totalAmountPaid)}</td>
                                        </tr>
                                        <tr className="balance-row">
                                            <td>Balance Amount</td>
                                            <td>{formatCurrency(calculateBalance(data.courseFee, data.totalAmountPaid))}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Payment Summary Box + Signature */}
                            <div className="receipt-footer">
                                <div className="payment-summary-box" style={{ flex: 1, marginRight: 24 }}>
                                    <div className="summary-row">
                                        <span className="summary-icon-wrapper"><WalletIcon /></span>
                                        <span className="summary-label">Payment Method :</span>
                                        <span className="summary-value">{data.paymentMethod}</span>
                                    </div>
                                    {needsTransactionId && (
                                        <div className="summary-row">
                                            <span className="summary-icon-wrapper"><HashIcon /></span>
                                            <span className="summary-label">Transaction ID :</span>
                                            <span className="summary-value">{data.transactionId || "—"}</span>
                                        </div>
                                    )}
                                    <div className="summary-row">
                                        <span className="summary-icon-wrapper"><UserCheckIcon /></span>
                                        <span className="summary-label">Received By :</span>
                                        <span className="summary-value">{data.receivedBy || "—"}</span>
                                    </div>
                                </div>

                                <div className="signature-area">
                                    <div className="signature-line" />
                                    <p className="signature-text">Authorized Signature &amp; Seal</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Banners — inline colors so html2pdf captures them */}
                        <div className="footer-banner-container" aria-hidden="true">
                            <div className="banner-purple" style={{ backgroundColor: "#3A025B" }} />
                            <div className="banner-yellow" style={{ backgroundColor: "#f4be1a" }} />
                        </div>
                    </div>
                </main>
            </div>

            {/* Print-only: isolate receipt */}
            <style>{`
        @media print {
          .app-container { display: block !important; }
          .sidebar { display: none !important; }
          .canvas {
            display: block !important;
            padding: 0 !important;
            height: 100vh !important;
            overflow: visible !important;
          }
          .receipt-wrapper {
            width: 100vw !important;
            height: 100vh !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
        </>
    );
}
