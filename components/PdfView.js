// PdfView.js
import React from 'react';
import {View, StyleSheet} from 'react-native';
import Pdf from 'react-native-pdf';

const PdfView = ({route}) => {
  const {localPdf} = route.params;

  return (
    <View style={styles.container}>
      <Pdf
        source={{uri: `file://${localPdf}`}}
        style={styles.pdf}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  pdf: {
    flex: 1,
  },
});

export default PdfView;
