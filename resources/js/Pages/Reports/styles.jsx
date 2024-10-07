import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    
    container: {
        padding: 20,
        backgroundColor: '#f9fafb', // Tailwind's bg-gray-100
    },
    details: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',

    },
    details2: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',


    },
    pBorder: {
        borderStyle: 'solid',
        borderColor: '#e5e7eb', // Tailwind's border-gray-200
        borderWidth: 1,
        width: '100%',
        padding: 7,
        fontSize: 16
    },
    p: {
        fontSize: 11
    },
    fontBold: {
        fontWeight: 'bold',
    },
    right: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    rightChild: {
        marginBottom: -1, // Adjust this value to set the negative gap
    },
    table: {
        display: 'table',
        width: '100%',
        borderStyle: 'solid',
        borderColor: '#e5e7eb', // Tailwind's border-gray-200
        borderWidth: 1,
        marginBottom: 10,
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
    },
    tableHead: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#00e1d2',
    },
    tableColSpan: {
        width: '50%', // Adjust this width according to the number of columns you want to span
        borderStyle: 'solid',
        borderColor: '#e5e7eb', // Tailwind's border-gray-200
        borderWidth: 1,
        padding: 5,
    },
    tableHeadings: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#00e1d2',
    },
    tableCol: {
        width: '100%',
        borderStyle: 'solid',
        borderColor: '#e5e7eb', // Tailwind's border-gray-200
        borderWidth: 1,
        padding: 5,
    },
    tableCell: {
        textAlign: 'center',
        fontSize: 10,
        padding: 1,
    },
   
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937', // Tailwind's text-gray-800
        marginBottom: 10,
    },
    image: {
        width: '75px',
        height: 'auto',
        marginBottom: 20,
    },
    hr: {
        width: '100%',
        height: 1,
        backgroundColor: '#cccccc', // Tailwind's border-gray-200
        marginVertical: 10,
    },
     header: {
        fontSize: 16,
        marginBottom: 10,
    },
    totalEarnings: {
        fontSize: 16,
        marginTop: 20,
        textAlign: 'right',
    },
    productImage: {
        width: 50,
        height: 50,
    },
    // totalEarnings: {
    //             fontSize: 16,
    //             marginTop: 20,
    //             textAlign: 'right',
    //         },
    section: {
                marginBottom: 10,
            },
});

export default styles;
