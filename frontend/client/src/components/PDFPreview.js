import { Document, Page, Text, View, PDFViewer, StyleSheet, Font } from '@react-pdf/renderer';

const PDFPreview = ({ title, vocabulary, summary, font, fontSizeTitle, fontSizeBody, lineSpacing, margin, backgroundColor, bodyColor }) => {
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
                <View style={{ flexDirection: 'column', alignItems: 'center', backgroundColor, margin: margin }}>
                    <Text style={{ fontSize: fontSizeTitle, marginBottom: 10, color: bodyColor }}>{title}</Text>
                    
                    <View style={{ width: '80%', marginTop: 20 }}>
                        <Text style={{ fontSize: (fontSizeBody + 4), marginBottom: 10, color: bodyColor }}>Terms</Text>
                    </View>
                    {vocabulary.map((item, index) => (
                        <View key={index} style={{ width: '80%', marginBottom: 10 }}>
                            <Text style={{ fontSize: fontSizeBody, lineHeight: lineSpacing, color: bodyColor, fontWeight: 'bold' }}>
                                {item.Term}:
                            </Text>
                            <Text style={{ fontSize: fontSizeBody, lineHeight: lineSpacing, color: bodyColor, marginLeft: 10 }}>
                                definition: {item.Definition}
                            </Text>
                            <Text style={{ fontSize: fontSizeBody, lineHeight: lineSpacing, color: bodyColor, marginLeft: 10 }}>
                                example: {item.Example}
                            </Text>
                        </View>
                    ))}

                    {/* Summary section */}
                    <View style={{ width: '80%', marginTop: 20 }}>
                        <Text style={{ fontSize: (fontSizeBody + 4), marginBottom: 10, color: bodyColor }}>Summary</Text>
                        {Object.keys(summary).map((key) => (
                        <Text key={key} style={{ fontSize: fontSizeBody, lineHeight: lineSpacing, color: bodyColor, marginLeft: 10}}>
                            - {summary[key]}
                        </Text>
                        ))}
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
