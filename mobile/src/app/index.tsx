import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Platform, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';

// Important: Change this IP to your computer's local network IP if testing on a real physical device.
// Keep it 10.0.2.2 for Android emulator, or localhost for web/iOS emulator.
const BACKEND_URL = 'http://192.168.0.11:5000'; // I updated this to your local IP!

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');

  const pickAndExtractText = async () => {
    try {
      // Step 1: Pick a PDF document
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      const file = result.assets[0];

      setLoading(true);
      setResultText('');

      // Step 2: Prepare for upload
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/pdf',
      } as any);

      // Step 3: Send to Node.js backend
      const response = await fetch(`${BACKEND_URL}/api/pdf/extract-text`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to connect or extract text from server.');
      }

      const data = await response.json();
      setResultText(data.text || 'No text found in PDF.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PDF Converter</Text>
        <Text style={styles.subtitle}>Mobile Edition</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={pickAndExtractText} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Upload PDF & Extract Text</Text>
          )}
        </TouchableOpacity>

        {resultText ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Extracted Text:</Text>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.resultText}>{resultText}</Text>
            </ScrollView>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    flex: 1,
    marginTop: 32,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  resultText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
});
