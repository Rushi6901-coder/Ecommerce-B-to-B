import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (order) => {
    if (!order) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Header ---
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text("INVOICE", pageWidth / 2, 20, { align: 'center' });

    // --- Company Info (Left) ---
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("B2B Commerce Platform", 14, 35);
    doc.setFont('helvetica', 'normal');
    // doc.text("123 Business Street", 14, 40);
    // doc.text("City, State, Zip", 14, 45);
    // doc.text("Email: support@b2bcommerce.com", 14, 50);

    // --- Invoice/Order Details (Right) ---
    doc.setFont('helvetica', 'bold');
    doc.text(`Invoice #: ${order.id}`, pageWidth - 14, 35, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, pageWidth - 14, 40, { align: 'right' });
    doc.text(`Status: ${order.status}`, pageWidth - 14, 45, { align: 'right' });

    // --- Bill To (Left) ---
    doc.text("Bill To:", 14, 60);
    doc.setFont('helvetica', 'bold');
    if (order.shopkeeper) {
        doc.text(order.shopkeeper.shopName || order.shopkeeper.name || "Customer", 14, 65);
    } else {
        doc.text("Customer", 14, 65);
    }

    // --- Vendor Info (if applicable) ---
    if (order.vendor) {
        doc.setFont('helvetica', 'normal');
        doc.text("Vendor:", 14, 75);
        doc.setFont('helvetica', 'bold');
        doc.text(order.vendor.shopName || order.vendor.name || "Vendor", 14, 80);
    }

    // --- Items Table ---
    const tableColumn = ["#", "Item", "Price", "Qty", "Total"];
    const tableRows = [];

    if (order.orderItems) {
        order.orderItems.forEach((item, index) => {
            const productData = [
                index + 1,
                item.product ? (item.product.name || "Product") : "Product",
                `Rs. ${item.price.toFixed(2)}`,
                item.quantity,
                `Rs. ${(item.price * item.quantity).toFixed(2)}`,
            ];
            tableRows.push(productData);
        });
    }

    // AutoTable
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 90,
        theme: 'striped',
        headStyles: { fillColor: [66, 139, 202] }, // Bootstrap Primary
        styles: { fontSize: 10 },
        foot: [[
            '', '', '', 'Grand Total:',
            `Rs. ${(order.totalAmount || 0).toFixed(2)}`
        ]],
        footStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
        }
    });

    // --- Footer ---
    const finalY = (doc).lastAutoTable.finalY || 150;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text("Thank you for your business!", pageWidth / 2, finalY + 20, { align: 'center' });

    // Save
    doc.save(`invoice_order_${order.id}.pdf`);
};
