import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOOLS = [
  { id: 'merge', title: 'Merge PDFs', description: 'Combine multiple PDF files into one.', icon: '📑' },
  { id: 'split', title: 'Split PDF', description: 'Extract pages from your PDF.', icon: '✂️' },
  { id: 'image-to-pdf', title: 'Image to PDF', description: 'Convert images to a single PDF.', icon: '🖼️' },
  { id: 'rotate', title: 'Rotate PDF', description: 'Rotate pages of your PDF.', icon: '🔄' },
  { id: 'watermark', title: 'Add Watermark', description: 'Stamp text or image on PDF.', icon: '©️' },
  { id: 'word-to-pdf', title: 'Word to PDF', description: 'Convert DOCX to PDF format.', icon: '📝' },
];

export default function ToolsScreen() {
  
  const handleToolPress = (title: string) => {
    Alert.alert("Coming Soon", `The ${title} feature will be available in the next update!`);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All PDF Tools</Text>
        <Text style={styles.subtitle}>Tap a tool to learn more.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {TOOLS.map((tool) => (
            <TouchableOpacity 
              key={tool.id} 
              style={styles.card} 
              activeOpacity={0.7}
              onPress={() => handleToolPress(tool.title)}
            >
              <Text style={styles.cardIcon}>{tool.icon}</Text>
              <Text style={styles.cardTitle}>{tool.title}</Text>
              <Text style={styles.cardDescription}>{tool.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    alignItems: 'flex-start',
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
  scrollContent: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'flex-start',
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
});
