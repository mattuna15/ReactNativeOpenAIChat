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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { RootStackParamList } from './App';
import { createHomeScreenDynamicStyles } from './HomeScreenDynamicStyles';
import { homeScreenStyles } from './HomeScreenStyles';
import { colors } from './colors';
import { errorDebug, logDebug } from './config';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const safeAreaInsets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === 'dark';
  const dynamicStyles = createHomeScreenDynamicStyles(isDarkMode);
  const scrollRef = useRef<ScrollView>(null);
  const [inputY, setInputY] = useState<number | null>(null);

  // Log whether the API key is present on mount so we can verify Metro logs are visible
  useEffect(() => {
    logDebug('[Startup] OPENAI_API_KEY present:', Boolean(OPENAI_API_KEY));
  }, []);

  useEffect(() => {
    const onKeyboardShow = () => {
      if (inputY != null && scrollRef.current) {
        // scroll so the input is visible when keyboard opens
        scrollRef.current.scrollTo({
          y: Math.max(inputY - 20, 0),
          animated: true,
        });
      }
    };

    const showSub = Keyboard.addListener('keyboardDidShow', onKeyboardShow);

    return () => {
      showSub.remove();
    };
  }, [inputY]);

  const callOpenAI = async (prompt: string): Promise<string> => {
    try {
      const payload = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      };

      logDebug('[OpenAI] Request payload:', payload);

      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify(payload),
        },
      );

      logDebug('[OpenAI] Response status:', response.status);

      const bodyText = await response.text();
      try {
        const data = JSON.parse(bodyText);
        logDebug('[OpenAI] Response body (json):', data);
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} - ${JSON.stringify(data)}`,
          );
        }
        return data.choices[0].message.content;
      } catch (jsonErr) {
        logDebug('[OpenAI] Response body (text):', bodyText);
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} - ${bodyText}`,
          );
        }
        throw jsonErr;
      }
    } catch (err) {
      errorDebug('[OpenAI] API call failed', err);
      throw new Error('Failed to get response from OpenAI');
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }

    if (!OPENAI_API_KEY) {
      Alert.alert(
        'Configuration Error',
        'Please set your OpenAI API key in the .env file',
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await callOpenAI(text.trim());
      navigation.navigate('Results', {
        response,
        prompt: text.trim(),
      });
      setText(''); // Clear the input
    } catch (error) {
      Alert.alert(
        'Error',
        `Failed to get response from OpenAI: ${
          error instanceof Error ? error.message : 'Unknown error'
        }. Please check your API key and try again.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <KeyboardAvoidingView
        style={homeScreenStyles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? safeAreaInsets.top + 44 : 20
        }
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={homeScreenStyles.screenInner}>
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={homeScreenStyles.content}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={[homeScreenStyles.title, dynamicStyles.title]}>
                AI Chat Assistant
              </Text>

              <TextInput
                style={[homeScreenStyles.textInput, dynamicStyles.textInput]}
                placeholder="Ask me anything..."
                placeholderTextColor={
                  isDarkMode
                    ? colors.dark.placeholder
                    : colors.light.placeholder
                }
                value={text}
                onChangeText={setText}
                multiline={true}
                textAlignVertical="top"
                onLayout={e => setInputY(e.nativeEvent.layout.y)}
                onFocus={() => {
                  if (inputY != null && scrollRef.current) {
                    scrollRef.current?.scrollTo({
                      y: Math.max(inputY - 20, 0),
                      animated: true,
                    });
                  }
                }}
              />

              <TouchableOpacity
                style={[
                  homeScreenStyles.button,
                  isLoading ? dynamicStyles.buttonDisabled : null,
                ]}
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
              <View
                style={homeScreenStyles.loadingOverlay}
                pointerEvents="auto"
              >
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;
