// ProductionReport.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import styles from './styles';
import moment from 'moment';

// Create styles
// const styles = StyleSheet.create({
//     page: {
//         flexDirection: 'column',
//         padding: 30,
//         fontSize: 12,
//         fontFamily: 'Helvetica',
//     },
//     section: {
//         margin: 10,
//         padding: 10,
//         flexGrow: 1,
//     },
//     header: {
//         fontSize: 24,
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     table: {
//         display: 'table',
//         width: 'auto',
//         marginBottom: 10,
//     },
//     tableRow: {
//         flexDirection: 'row',
//         borderBottom: '1px solid #000',
//         padding: 5,
//     },
//     tableCell: {
//         flex: 1,
//         padding: 5,
//     },
// });

const ProductionReport = ({ ordersData, onGoingCount, ordersCount, priorityCount, errorsCount, printers }) => (
    <Document>
        <Page size="A4" style={styles.container}>
            <View style={styles.details}>
                <Image
                    style={styles.image}
                    src="/images/TJM_Logo.png" // Replace with your image URL or path
                />
                <View style={styles.right}>
                    <Text style={[styles.heading, styles.rightChild]}>TJM SPORTSWEAR</Text>
                    <Text style={styles.fontBold}>Production Report</Text>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.header}>Summary</Text>
                <Text style={styles.p}>On Going Count: {onGoingCount}</Text>
                <Text style={styles.p}>Orders Count: {ordersCount}</Text>
                <Text style={styles.p}>Priority Count: {priorityCount}</Text>
                <Text style={styles.p}>Errors Count: {errorsCount}</Text>
            </View>
            <View style={styles.hr} />
            <View style={styles.section}>
                <Text>Orders</Text>
                <View style={styles.table}>
                    <View style={styles.tableHead}>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Order</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Due Date</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Status</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Start Production</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Ended</Text></View>
                        {/* <View style={styles.tableCol}><Text style={styles.tableCell}>Earnings</Text></View> */}
                    </View>
                    {ordersData.map((order, index) => (
                        <View key={index} style={styles.tableRow}>

                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{order.team_name}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{moment(order.due_date).format('MMMM do YYYY')}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{order.production.status}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{moment(order.production.start_production).format('MMMM do YYYY')}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{moment(order.production.start_production).format('MMMM do YYYY')}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.section}>
                <Text>Printers Data</Text>
                <View style={styles.tableHead}>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>Printer</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>Good Count</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>Error Count</Text></View>
                </View>
                {printers.map((printer, index) => (
                    <View key={index} style={styles.tableRow}>
                
                        <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{printer.equipment_name}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{printer.orders.reduce((sum, order) => sum + order.order.lineups.filter(lineup => lineup.status !== 'Error').length, 0)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{printer.orders.reduce((sum, order) => sum + order.order.lineups.filter(lineup => lineup.status === 'Error').length, 0)}</Text>
                            </View>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default ProductionReport;
