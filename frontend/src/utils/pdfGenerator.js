import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePackingSlip = (order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Header & Branding ---
    doc.setFontSize(22);
    doc.setTextColor(99, 125, 55); // #637D37 (Olive Green)
    doc.setFont('helvetica', 'bold');
    doc.text('PACKING SLIP', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    const orderDate = new Date(order.createdAt).toLocaleDateString();
    doc.text(`Order ID: #${order.id.slice(-8).toUpperCase()}`, 14, 30);
    doc.text(`Date: ${orderDate}`, 14, 35);

    // --- Customer Details Section ---
    doc.setFillColor(248, 250, 252); // Light gray background
    doc.rect(14, 45, pageWidth - 28, 40, 'F');

    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text('SHIP TO:', 20, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(order.user.userName, 20, 62);
    doc.text(order.shippingAddress || 'N/A', 20, 67);
    doc.text(`${order.city}, ${order.state} - ${order.zip}`, 20, 72);
    doc.text(`Phone: ${order.phoneNumber || 'N/A'}`, 20, 77);

    // --- Items Table ---
    const tableColumn = ["Item", "SKU", "Price", "Qty", "Total"];
    const tableRows = [];

    order.orderItems.forEach(item => {
        const itemData = [
            item.product.name,
            item.product.sku,
            `INR ${item.price}`,
            item.quantity,
            `INR ${item.price * item.quantity}`
        ];
        tableRows.push(itemData);
    });

    doc.autoTable({
        startY: 95,
        head: [tableColumn],
        body: tableRows,
        headStyles: {
            fillColor: [99, 125, 55],
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold'
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [80, 80, 80]
        },
        alternateRowStyles: {
            fillColor: [252, 253, 250]
        },
        margin: { top: 95 },
        theme: 'striped'
    });

    // --- Footer ---
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);

    const totalRevenue = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    doc.text(`Total Shipment Value: INR ${totalRevenue.toLocaleString()}`, 14, finalY);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for choosing our marketplace. Please visit us again!', 14, finalY + 15);

    // --- Save the PDF ---
    doc.save(`Packing_Slip_Order_${order.id.slice(-6).toUpperCase()}.pdf`);
};
