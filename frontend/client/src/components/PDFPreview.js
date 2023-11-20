import { Document, Page, Text, View, PDFViewer, StyleSheet, Font } from '@react-pdf/renderer';

const PDFPreview = ({ font, fontSizeTitle, fontSizeBody, lineSpacing, margin, backgroundColor, bodyColor }) => {
    // Register the font
    Font.register({
        family: font,
        src: `https://fonts.gstatic.com/s/${font}/v14/${font}-regular.ttf`,
    });

    const generatePDF = () => {
        // Generate the PDF content based on the settings
        const MyDocument = (
        <Document>
            <Page size="A4">
            
            <View style={{ flexDirection: 'column', alignItems: 'center', backgroundColor }}>
                <Text style={{ fontSize: fontSizeTitle, marginBottom: 10, color: bodyColor }}>Main Title</Text>
                <View style={{ width: '80%', marginBottom: 10 }}>
                <Text style={{ fontSize: fontSizeBody, lineHeight: lineSpacing, color: bodyColor }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris.
                    Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor.
                    Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta
                    lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor
                    sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed,
                    adipiscing id dolor.
                </Text>

                </View>
            </View>
            </Page>
        </Document>
        );

        return MyDocument;
    };

    const pdfData = generatePDF();

    return (
        <PDFViewer style={{ width: '100%', height: '500px' }}>
        {pdfData}
        </PDFViewer>
    );
};

export default PDFPreview;
