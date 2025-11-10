import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from './App';
import { createResultsScreenDynamicStyles } from './ResultsScreenDynamicStyles';
import { resultsScreenStyles } from './ResultsScreenStyles';

type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Results'>;
type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

interface ResultsScreenProps {
  route: ResultsScreenRouteProp;
  navigation: ResultsScreenNavigationProp;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ route, navigation }) => {
  const { response, prompt } = route.params;
  const safeAreaInsets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === 'dark';
  const dynamicStyles = createResultsScreenDynamicStyles(isDarkMode);

  return (
    <View
      style={[
        resultsScreenStyles.container,
        dynamicStyles.container,
        {
          paddingTop: safeAreaInsets.top,
        },
      ]}
    >
      <View style={resultsScreenStyles.header}>
        <TouchableOpacity style={resultsScreenStyles.backButton} onPress={navigation.goBack}>
          <Text style={resultsScreenStyles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={[resultsScreenStyles.title, dynamicStyles.title]}>AI Response</Text>
      </View>

      <ScrollView style={resultsScreenStyles.content} showsVerticalScrollIndicator={false}>
        <View style={[resultsScreenStyles.promptCard, dynamicStyles.promptCard]}>
          <Text style={[resultsScreenStyles.cardTitle, dynamicStyles.cardTitle]}>Your Prompt:</Text>
          <Text style={[resultsScreenStyles.promptText, dynamicStyles.promptText]}>{prompt}</Text>
        </View>

        <View style={[resultsScreenStyles.responseCard, dynamicStyles.responseCard]}>
          <Text style={[resultsScreenStyles.cardTitle, dynamicStyles.cardTitle]}>AI Response:</Text>
          <Text style={[resultsScreenStyles.responseText, dynamicStyles.responseText]}>
            {response ?? 'No response available.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ResultsScreen;
