import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#f9f9f9',
  },
  header: {
    marginBottom: 30,
    borderBottom: '1px solid #ccc',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  table: {
    width: '100%',
    marginTop: 20,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    height: 30,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    height: 25,
    paddingVertical: 5,
  },
  tableCell: {
    fontSize: 10,
    paddingHorizontal: 5,
  },
  totals: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: '1px solid #ccc',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 12,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  companyInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
});

const FacturaPDF = ({ order, details, sequential }) => {
  const calculateIVA = (subtotal) => subtotal * 0.12;
  const subtotal = details.reduce((sum, d) => sum + d.Subtotal, 0);
  const iva = calculateIVA(subtotal);
  const total = subtotal + iva;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabecera */}
        <View style={styles.header}>
          <Text style={styles.title}>FACTURA ELECTRÓNICA</Text>
          <Text style={styles.subtitle}>Número: {sequential}</Text>
          <Text style={styles.subtitle}>Fecha: {new Date(order.FechaPedido).toLocaleDateString()}</Text>
        </View>

        {/* Información de la Empresa */}
        <View style={styles.section}>
          <Text style={styles.companyInfo}>Nombre de la Empresa</Text>
          <Text style={styles.companyInfo}>Dirección: Calle Principal 123</Text>
          <Text style={styles.companyInfo}>Teléfono: 123-456-7890</Text>
          <Text style={styles.companyInfo}>Email: contacto@empresa.com</Text>
        </View>

        {/* Información del Cliente */}
        <View style={styles.section}>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>Cliente:</Text>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{order.NombreCliente}</Text>
          <Text style={{ fontSize: 12 }}>RUC: {order.RUC}</Text>
        </View>

        {/* Detalle de Productos */}
        <View style={styles.table}>
          {/* Encabezados de la tabla */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { width: '40%' }]}>Producto</Text>
            <Text style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}>Cantidad</Text>
            <Text style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}>P. Unitario</Text>
            <Text style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}>Subtotal</Text>
            <Text style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}>IVA</Text>
          </View>

          {/* Filas de productos */}
          {details.map((detail, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '40%' }]}>{detail.NombreProducto}</Text>
              <Text style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}>{detail.Cantidad}</Text>
              <Text style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}>${detail.PrecioUnitario.toFixed(2)}</Text>
              <Text style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}>${detail.Subtotal.toFixed(2)}</Text>
              <Text style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}>${calculateIVA(detail.Subtotal).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IVA (12%):</Text>
            <Text style={styles.totalValue}>${iva.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontSize: 14 }]}>Total:</Text>
            <Text style={[styles.totalValue, { fontSize: 14, fontWeight: 'bold' }]}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text>Gracias por su compra. ¡Esperamos servirle nuevamente!</Text>
        </View>
      </Page>
    </Document>
  );
};

export default FacturaPDF;