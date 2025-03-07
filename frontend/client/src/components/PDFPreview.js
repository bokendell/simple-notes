import { Document, Page, Text, View, Font } from "@react-pdf/renderer";

const PDFPreview = ({
	title,
	vocabulary,
	summary,
	font,
	fontSizeTitle,
	fontSizeSubHeading,
	fontSizeBody,
	lineSpacing,
	margin,
	backgroundColor,
	bodyColor,
}) => {
	// Register the font
	Font.register({
		family: "OpenSans",
		src: "https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf",
	});

	const generatePDF = () => {
		// Generate the PDF content based on the settings
		const MyDocument = (
			<Document>
				<Page size="A4">
					<View
						style={{
							flexDirection: "column",
							alignItems: "center",
							backgroundColor,
							margin: margin,
						}}
					>
						{/* Title section */}
						<Text
							style={{
								fontSize: fontSizeTitle,
								marginBottom: 10,
								color: bodyColor,
								fontFamily: font,
							}}
						>
							{title}
						</Text>
						{/* Vocabulary section */}
						<View style={{ width: "80%", marginTop: 20 }}>
							<Text
								style={{
									fontSize: fontSizeSubHeading,
									marginBottom: 10,
									color: bodyColor,
								}}
							>
								Terms
							</Text>
						</View>
						{vocabulary.map((item, index) => (
							<View
								key={index}
								style={{ width: "80%", marginBottom: 10 }}
							>
								<Text
									style={{
										fontSize: fontSizeBody,
										lineHeight: lineSpacing,
										color: bodyColor,
										fontWeight: "bold",
										fontFamily: font,
									}}
								>
									{item.Term}:
								</Text>
								<Text
									style={{
										fontSize: fontSizeBody,
										lineHeight: lineSpacing,
										color: bodyColor,
										marginLeft: 10,
										fontFamily: font,
									}}
								>
									definition: {item.Definition}
								</Text>
								<Text
									style={{
										fontSize: fontSizeBody,
										lineHeight: lineSpacing,
										color: bodyColor,
										marginLeft: 10,
										fontFamily: font,
									}}
								>
									example: {item.Example}
								</Text>
							</View>
						))}

						{/* Summary section */}
						<View style={{ width: "80%", marginTop: 20 }}>
							<Text
								style={{
									fontSize: fontSizeSubHeading,
									marginBottom: 10,
									color: bodyColor,
									fontFamily: font,
								}}
							>
								Summary
							</Text>
							{Object.keys(summary).map((key) => (
								<Text
									key={key}
									style={{
										fontSize: fontSizeBody,
										lineHeight: lineSpacing,
										color: bodyColor,
										marginLeft: 10,
										fontFamily: font,
									}}
								>
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
		// <PDFViewer style={{ width: '100%', height: '500px' }}>
		// {pdfData}
		// </PDFViewer>
		pdfData
	);
};

export default PDFPreview;
