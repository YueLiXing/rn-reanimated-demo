/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback} from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text, TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {logger} from "react-native-logs";

import {NativeSyntheticEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import {NativeScrollEvent} from 'react-native/Libraries/Components/ScrollView/ScrollView';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import ACNoticeHorText from './src/ACNoticeHorText.tsx';
import {runOnJS} from 'react-native-worklets';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? 'white' : 'black',
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? 'white' : 'black',
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const log = logger.createLogger();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: 'white',
  };
  const safePadding = '5%';

  const onClickTestLog = () => {
    log.debug("This is a Debug log");
    log.info("This is an Info log");
    log.warn("This is a Warning log");
    log.error("This is an Error log");
  }
  const shareHeight = useSharedValue(0);
  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nativeEvent = event.nativeEvent;
    shareHeight.value = event.nativeEvent.contentOffset.y / nativeEvent.contentSize.height * nativeEvent.layoutMeasurement.height;
    // shareHeight.value = event.nativeEvent.contentOffset.y;
  }, [shareHeight]);
  const changeStatusBar = useCallback((bar: 'dark-content' | 'light-content') => {

    StatusBar.setBarStyle(bar, false);
  }, []);
  useAnimatedReaction(() => shareHeight.value > 200, (prepared, previous) => {
    if (prepared !== previous) {
      runOnJS(changeStatusBar)(prepared ? "dark-content" : 'light-content');
    }
  })
  const aniStyle0 = useAnimatedStyle(() => {
    return {position: 'absolute', height: shareHeight.value, backgroundColor: 'red', right: 0, width: 5, top: 0}
  });
  const dheight = useDerivedValue(() => {
    return shareHeight.value;
  });
  const aniStyle1 = useAnimatedStyle(() => {
    return {position: 'absolute', height: dheight.value, backgroundColor: 'yellow', right: 5, width: 5, top: 0}
    // return {position: 'absolute', height: shareHeight.value, backgroundColor: 'yellow', right: 5, width: 5, top: 0}
  });
  const aniStyle2 = useAnimatedStyle(() => {
    return {position: 'absolute', height: shareHeight.value, backgroundColor: 'black', right: 10, width: 5, top: 0}
  });
  const aniStyle3 = useAnimatedStyle(() => {
    return {position: 'absolute', height: shareHeight.value, backgroundColor: 'pink', right: 15, width: 5, top: 0}
  });
  const canAni = useSharedValue(true);
  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        style={backgroundStyle} onScroll={onScroll}>
        <View style={{ paddingRight: safePadding }}>
          <Text>Header</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            paddingHorizontal: safePadding,
            paddingBottom: safePadding,
          }}>
          <TouchableOpacity onPress={onClickTestLog}>
            <Text>Test Log</Text>
          </TouchableOpacity>

          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <Text>ReloadInstructions</Text>
          </Section>
          <Section title="Debug">
            <Text>DebugInstructions</Text>
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>

          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <Text>ReloadInstructions</Text>
          </Section>
          <Section title="Debug">
            <Text>DebugInstructions</Text>
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>

          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <Text>ReloadInstructions</Text>
          </Section>
          <Section title="Debug">
            <Text>DebugInstructions</Text>
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>

          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <Text>ReloadInstructions</Text>
          </Section>
          <Section title="Debug">
            <Text>DebugInstructions</Text>
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>

          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <Text>ReloadInstructions</Text>
          </Section>
          <Section title="Debug">
            <Text>DebugInstructions</Text>
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <Text>LearnMoreLinks</Text>
        </View>
        {/*<View style={{ marginLeft: 10,width: '90%', borderWidth: 1}}>*/}
        {/*  <ACNoticeHorText color={'red'} canAni={canAni} content={'横向滚动公告，今天冰箱大促销。一个一个不要钱啊不要钱。快来快来快来'}/>*/}
        {/*</View>*/}
      </ScrollView>
      <Animated.View style={aniStyle0}/>
      <Animated.View style={aniStyle1}/>
      <Animated.View style={aniStyle2}/>
      <Animated.View style={aniStyle3}/>
      {/*<View style={{position: 'absolute', left: 20, right: 20, borderWidth: 1, top: 80}}>*/}
      {/*  <ACNoticeHorText color={'red'} canAni={canAni} content={'横向滚动公告，今天冰箱大促销。一个一个不要钱啊不要钱。快来快来快来'}/>*/}
      {/*</View>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
