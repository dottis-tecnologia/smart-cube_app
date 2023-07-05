import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Center,
  HStack,
  Heading,
  Icon,
  IconButton,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import { TabParamList } from "./Tabs";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { formatDistanceToNow, intlFormat } from "date-fns";
import { FontAwesome } from "@expo/vector-icons";
import FocusAwareStatusBar from "../../components/util/FocusAwareStatusBar";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInUp,
  SlideInLeft,
} from "react-native-reanimated";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Root";
import useQuery from "../../hooks/useQuery";
import { dbQuery } from "../../util/db";

export type HomeProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedHStack = Animated.createAnimatedComponent(HStack);

const getMeters = () =>
  dbQuery<{
    id: string;
    meterId: string;
    value: number;
    createdAt: string;
    unit: string;
    location: string;
  }>(
    "SELECT readings.*, meters.unit, meters.location FROM readings JOIN meters ON readings.meterId = meters.id ORDER BY createdAt DESC LIMIT 12;"
  );
export default function Home({ navigation }: HomeProps) {
  const { data: readings } = useQuery(getMeters);
  const { data: readingCount } = useQuery(() =>
    dbQuery<{ count: 5 }>(
      "SELECT COUNT(*) as count FROM readings WHERE date(createdAt) = date('now');"
    )
  );

  return (
    <Box flex={1} bg="primary.400" safeArea>
      <FocusAwareStatusBar style="light" />
      <ScrollView bg="light.100">
        <AnimatedBox
          bg={{
            linearGradient: {
              colors: ["primary.400", "secondary.400"],
              start: [0, 0],
              end: [0, 1],
            },
          }}
          p={3}
          entering={FadeInUp}
        >
          <Center p={3}>
            <Heading color="white">LOGO</Heading>
          </Center>
          <AnimatedBox entering={FadeInLeft.delay(100)}>
            <Text color="light.100">Welcome,</Text>
            <Heading fontStyle="italic" mb={5} color="white">
              John Smith
            </Heading>
          </AnimatedBox>
        </AnimatedBox>
        <AnimatedBox
          bg="white"
          w="80%"
          mx="auto"
          p={5}
          mt={-6}
          mb={3}
          rounded="md"
          textAlign={"center"}
          entering={FadeInUp.delay(150)}
        >
          <Text color="secondary.400">Readings today</Text>
          <Heading color="emphasis.500">
            {readingCount?.rows[0].count || 0}
          </Heading>
        </AnimatedBox>

        <Box p={3}>
          <Heading size="sm" mb={3}>
            Latest readings
          </Heading>
          {readings?.rows.map((reading, index) => (
            <AnimatedHStack
              key={reading.id}
              p={5}
              mb={3}
              bg="white"
              rounded="lg"
              alignItems="center"
              space={5}
              entering={SlideInLeft.delay(index * 100)}
            >
              <IconButton
                _icon={{ as: FontAwesome, name: "eye" }}
                variant={"outline"}
                onPress={() =>
                  navigation.navigate("Reading", { id: reading.id })
                }
              ></IconButton>
              <VStack flex={1}>
                <Text color="emphasis.500">{reading.meterId}</Text>
                <Text>{reading.location}</Text>
                <Text color="light.500">
                  {formatDistanceToNow(new Date(reading.createdAt), {
                    addSuffix: true,
                  })}
                </Text>
              </VStack>
              <Text color="red.500" fontWeight={"bold"}>
                {reading.value} {reading.unit}
              </Text>
            </AnimatedHStack>
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
}
