import { OPENAI_API_KEY } from '@env';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from './App';
import { createHomeScreenDynamicStyles } from './HomeScreenDynamicStyles';
import { homeScreenStyles } from './HomeScreenStyles';
import { colors } from './colors';
import { logDebug } from './config';
import { callOpenAI } from './openai';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
  // Optional testing hook: provide a ref object for ScrollView so tests can spy on scrollTo
  scrollRefProp?: React.RefObject<ScrollView>;
  // For tests only: initialize the loading state
  testInitialLoading?: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  navigation,
  scrollRefProp,
  testInitialLoading,
}) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(testInitialLoading));
  const safeAreaInsets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === 'dark';
  const dynamicStyles = createHomeScreenDynamicStyles(isDarkMode);
  const scrollRef = useRef<ScrollView>(null);
  const [inputY, setInputY] = useState<number | null>(null);
  const isMountedRef = useRef(true);
  // Use injected ref in tests when provided
  const effectiveScrollRef = (scrollRefProp ?? scrollRef) as React.RefObject<ScrollView>;

  // Log whether the API key is present on mount so we can verify Metro logs are visible
  useEffect(() => {
    logDebug('[Startup] OPENAI_API_KEY present:', Boolean(OPENAI_API_KEY));
  }, []);

  useEffect(() => {
    const onKeyboardShow = () => {
      if (inputY != null && effectiveScrollRef.current) {
        // scroll so the input is visible when keyboard opens
        effectiveScrollRef.current.scrollTo({
          y: Math.max(inputY - 20, 0),
          animated: true,
        });
      }
    };

    const showSub = Keyboard.addListener('keyboardDidShow', onKeyboardShow);

    return () => {
      showSub.remove();
      isMountedRef.current = false;
    };
  }, [inputY, effectiveScrollRef]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }

    if (!OPENAI_API_KEY) {
      Alert.alert('Configuration Error', 'Please set your OpenAI API key in the .env file');
      return;
    }

    setIsLoading(true);
    try {
      const response = await callOpenAI(text.trim());
      navigation.navigate('Results', {
        response,
        prompt: text.trim(),
      });
      if (isMountedRef.current) setText(''); // Clear the input
    } catch (error) {
      Alert.alert(
        'Error',
        `Failed to get response from OpenAI: ${
          error instanceof Error ? error.message : 'Unknown error'
        }. Please check your API key and try again.`
      );
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <KeyboardAvoidingView
        style={homeScreenStyles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? safeAreaInsets.top + 44 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={homeScreenStyles.screenInner}>
            <ScrollView
              testID="home-scrollview"
              // prefer the injected ref prop for tests, fall back to internal ref
              ref={effectiveScrollRef as unknown as React.Ref<ScrollView>}
              contentContainerStyle={homeScreenStyles.content}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={[homeScreenStyles.title, dynamicStyles.title]}>AI Chat Assistant</Text>

              <TextInput
                style={[homeScreenStyles.textInput, dynamicStyles.textInput]}
                placeholder="Ask me anything..."
                placeholderTextColor={
                  isDarkMode ? colors.dark.placeholder : colors.light.placeholder
                }
                value={text}
                onChangeText={setText}
                multiline={true}
                textAlignVertical="top"
                onLayout={(e) => setInputY(e.nativeEvent.layout.y)}
                onFocus={() => {
                  if (inputY != null && effectiveScrollRef.current) {
                    effectiveScrollRef.current?.scrollTo({
                      y: Math.max(inputY - 20, 0),
                      animated: true,
                    });
                  }
                }}
              />

              <TouchableOpacity
                testID="submit-button"
                style={[homeScreenStyles.button, isLoading ? dynamicStyles.buttonDisabled : null]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={homeScreenStyles.buttonText}>Submit to AI</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
            {isLoading && (
              <View style={homeScreenStyles.loadingOverlay} pointerEvents="auto">
                <ActivityIndicator testID="loading-indicator" size="large" color="#fff" />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;
