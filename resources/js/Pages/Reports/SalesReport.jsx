// resources/js/Components/SalesReport.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import styles from './styles';
import moment from 'moment';
// Define styles
// const styles = StyleSheet.create({
//     page: {
//         padding: 30,
//     },
//     section: {
//         marginBottom: 10,
//     },
//     title: {
//         fontSize: 24,
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     table: {
//         display: "table",
//         width: "auto",
//         margin: "0 auto",
//         marginBottom: 20,
//     },
//     tableRow: {
//         flexDirection: "row",
//     },
//     tableCol: {
//         width: "25%",
//         borderStyle: "solid",
//         borderWidth: 1,
//         borderColor: '#000',
//         padding: 5,
//     },
//     tableCell: {
//         fontSize: 10,
//     },
//     header: {
//         fontSize: 16,
//         marginBottom: 10,
//     },
//     totalEarnings: {
//         fontSize: 16,
//         marginTop: 20,
//         textAlign: 'right',
//     },
//     productImage: {
//         width: 50,
//         height: 50,
//     }
// });

const SalesReport = ({ chartData, orderData, earningsData, ordersData }) => {
    return (
        <Document>
            <Page style={styles.container}>
                {/* Title Section */}
                {/* <Text style={styles.title}>Sales Report</Text> */}

                <View style={styles.details}>
                    <Image
                        style={styles.image}
                        src="/images/TJM_Logo.png" // Replace with your image URL or path
                    />
                    <View style={styles.right}>
                        <Text style={[styles.heading, styles.rightChild]}>TJM SPORTSWEAR</Text>
                        <Text style={styles.fontBold}>Sales Report</Text>
                    </View>
                </View>
                {/* Orders and Earnings Summary */}
                <View style={styles.section}>
                    <Text style={styles.header}>Summary</Text>
                    <Text style={styles.p}>Total Orders: {orderData}</Text>
                    <Text style={styles.p}>Total Earnings: Php {earningsData?.toLocaleString()}</Text>
                </View>
                <View style={styles.hr} />
                {/* Top Products Table */}
                <View style={styles.section}>
                    <Text style={styles.header}>Top Products</Text>
                    <View style={styles.table}>
                        {/* Table Header */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Product</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Orders</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Earnings</Text></View>
                            {/* <View style={styles.tableCol}><Text style={styles.tableCell}>Earnings</Text></View> */}
                        </View>

                        {/* Table Data */}
                        {chartData?.map((product, index) => (
                            <View key={index} style={styles.tableRow}>
                                {/* <View style={styles.tableCol}>
                                    <Image 
                                        src={product.image ? `/images/products/${product.image}` : '/images/placeholder.png'} 
                                        style={styles.productImage} 
                                    />
                                </View> */}
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{product.products.product_name}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{product.count}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>Php {product.total_price.toFixed(2)}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.header}>Order Sales</Text>
                    <View style={styles.table}>
                        {/* Table Header */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Team</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Due Date</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Total Price</Text></View>
                            {/* <View style={styles.tableCol}><Text style={styles.tableCell}>Earnings</Text></View> */}
                        </View>

                        {/* Table Data */}
                        {ordersData?.map((order, index) => (
                            <View key={index} style={styles.tableRow}>
                                {/* <View style={styles.tableCol}>
                                    <Image 
                                        src={order.image ? `/images/orders/${order.image}` : '/images/placeholder.png'} 
                                        style={styles.orderImage} 
                                    />
                                </View> */}
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{order.team_name}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{moment(order.due_date).format('MMMM d YYYY')}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>Php {order.total_price.toFixed(2)}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default SalesReport;
