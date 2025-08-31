import {
  AppState,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TextLayoutEventData,
  View,
} from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useCallback, useEffect, useMemo } from 'react';

interface ACNoticeHorTextProps {
  content: string;
  color: string | null | undefined;
  canAni: SharedValue<boolean>;
}
const tag = 'ACNoticeHorText';
const ACNoticeHorText = (props: ACNoticeHorTextProps) => {
  const { content, color, canAni } = props;
  const lineWidth = useSharedValue<number>(0);
  const textBackWidth = useSharedValue<number>(0);
  const translateX1 = useSharedValue(0);
  const translateX2 = useSharedValue(500);
  const isForground = useSharedValue(true);
  const hasAni = useDerivedValue(() => {
    return (
      lineWidth.value > 0 &&
      textBackWidth.value > 0 &&
      lineWidth.value > textBackWidth.value &&
      canAni.value &&
      isForground.value
    );
  });
  useEffect(() => {
    lineWidth.value = 0;
  }, [content, lineWidth]);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        isForground.value = true;
      } else if (state === 'background') {
        isForground.value = false;
      }
    });
    return () => sub.remove();
  }, [isForground]);

  useAnimatedReaction(
    () => {
      return hasAni.value;
    },
    (prepared, previous) => {
      if (prepared === previous) {
        return;
      }
      // return;
      cancelAnimation(translateX1);
      cancelAnimation(translateX2);
      if (prepared) {
        if (lineWidth.value < textBackWidth.value) {
          // 单行不轮播
          return;
        }
        const getDuration = (distance: number) => {
          console.log(tag, 'getDuration', distance, distance / 150);
          return (distance / 15.0) * 200;
        };
        // 计算滚动距离：内容宽度 + 间隔
        const gap = 50; // 间隔 50pt
        const l = lineWidth.value;
        const w = textBackWidth.value;
        const dl = getDuration(l);
        const dw = getDuration(w);
        const dGap = getDuration(gap);
        const t0 = Math.ceil(dl + dGap + dw);
        const t1 = Math.ceil(dl + dGap - dw);

        translateX1.value = w;
        translateX1.value = withRepeat(
          withSequence(
            withTiming(w, { duration: 1 }),
            withTiming(-l - gap, { duration: t0, easing: Easing.linear }),
            withTiming(w, { duration: 1 }),
            withTiming(w, { duration: t1 })
          ),
          -1,
          false
        );
        translateX2.value = w;
        translateX2.value = withDelay(
          dl + dGap,
          withRepeat(
            withSequence(
              withTiming(w, { duration: 1 }),
              withTiming(-l - gap, { duration: t0, easing: Easing.linear }),
              withTiming(w, { duration: 1 }),
              withTiming(w, { duration: t1 })
            ),
            -1,
            false
          )
        );
      } else {
        translateX1.value = 0;
        translateX2.value = textBackWidth.value;
      }
    }
  );

  const onTextBackLayout = useCallback(
    (event: LayoutChangeEvent) => {
      textBackWidth.value = event.nativeEvent.layout.width;
      console.log(tag, 'onTextBackLayout', event.nativeEvent.layout);
    },
    [textBackWidth]
  );

  const textSizeStyle = useMemo(() => {
    return {
      color: color ?? '#111111',
      width: 100000,
    };
  }, [color]);

  const onTextLayout = useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      const lines = event.nativeEvent.lines;
      if (lines.length > 0) {
        lineWidth.value = lines[0].width;
      }
      console.log(tag, 'onTextLayout', event.nativeEvent.lines[0].width);
    },
    [lineWidth]
  );

  const aniStyle1 = useAnimatedStyle(() => {
    return {
      left: translateX1.value,
      // transform: [{ translateX: translateX1.value }],
    };
  });

  const aniStyle2 = useAnimatedStyle(() => {
    return {
      left: translateX2.value,
      // transform: [{ translateX: translateX2.value }],
    };
  });

  return (
    <View style={styles.textBack} onLayout={onTextBackLayout}>
      <Animated.Text style={[styles.text, textSizeStyle, aniStyle1]} onTextLayout={onTextLayout}>
        {content}
      </Animated.Text>
      <Animated.Text style={[styles.text, textSizeStyle, aniStyle2]}>{content}</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textBack: {
    marginLeft: 6,
    height: 18,
    flex: 1,
    overflow: 'hidden',
  },
  text: {
    position: 'absolute',
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
  },
});

export default ACNoticeHorText;
