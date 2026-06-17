import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import {
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import { formatDistanceToNow, isToday } from "date-fns";
import useQuery from "../hooks/useQuery";
import { dbQuery } from "../util/db";
import Animated, { FadeInLeft } from "react-native-reanimated";
import useInfiniteQuery from "../hooks/useInfiniteQuery";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import dateFnsLocale from "../util/dateFnsLocale";
import useStatusBar from "../hooks/useStatusBar";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "react-native-paper";

export type ListMetersProps = NativeStackScreenProps<
  RootStackParamList,
  "ListMeters"
>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const perPage = 8;

type DataType = {
  id: string;
  name: string;
  createdAt?: string;
};

export default function ListMeters({
  route: { params },
  navigation,
}: ListMetersProps) {
  const { location } = params;
  const { t } = useTranslation();
  const theme = useTheme();
  useStatusBar({ style: "dark" });

  const { data, fetchNextPage, isFinished, isRefreshing, refresh } =
    useInfiniteQuery(
      (pageParam: string) =>
        dbQuery<DataType>(
          `SELECT meters.*, MAX(readings.createdAt) as createdAt 
        FROM meters LEFT JOIN readings ON readings.meterId = meters.id 
        WHERE meters.location = ? 
        GROUP BY meters.id 
        HAVING meters.id > ?
        ORDER BY meters.id LIMIT ?
        `,
          [location, pageParam, perPage]
        ),

      (lastPage) => {
        if (lastPage == null) {
          return "";
        }

        if (lastPage.rows.length < perPage) {
          return null;
        }

        return lastPage.rows[lastPage.rows.length - 1].id;
      },
      [location]
    );
  const { data: readingsToday } = useQuery(
    () =>
      dbQuery<{
        count: number;
      }>(
        `SELECT COUNT(readings.id) as count 
         FROM readings JOIN meters ON readings.meterId = meters.id 
         WHERE meters.location = ? AND date(createdAt) == date('now')`,
        [location]
      ),
    [location]
  );
  const { data: readingsTotal } = useQuery(
    () =>
      dbQuery<{
        count: number;
      }>(
        `SELECT COUNT(id) as count 
         FROM meters 
         WHERE location = ?`,
        [location]
      ),
    [location]
  );

  const flatData = data.reduce<DataType[]>(
    (prev, curr) => [...prev, ...curr.rows],
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              start={[0, 0]}
              end={[0, 1]}
              style={styles.header}
            >
              <View style={styles.headerContent}>
                <Text style={styles.locationTitle}>
                  <Text style={styles.locationLabel}>
                    {t("listMeters.location").toUpperCase()}:
                  </Text>{" "}
                  {location}
                </Text>
                <Text style={styles.readingsCount}>
                  {t("listMeters.readingsToday", {
                    num: readingsToday?.rows[0].count ?? "-",
                    den: readingsTotal?.rows[0]?.count ?? "-",
                  })}
                </Text>
              </View>
            </LinearGradient>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {t("listMeters.meters")}
              </Text>
            </View>
          </>
        }
        data={flatData}
        onEndReached={() => !isFinished && fetchNextPage()}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListFooterComponent={
          !isFinished ? (
            <View style={styles.footer}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <ListItem
            {...item}
            onPress={() => navigation.navigate("Meter", { id: item.id })}
          />
        )}
      />
    </View>
  );
}

const ListItem = memo(
  ({
    createdAt,
    name,
    onPress,
  }: {
    createdAt?: string;
    name: string;
    onPress: () => void;
  }) => {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const hasReadingToday = createdAt && isToday(new Date(createdAt));
    
    return (
      <AnimatedPressable
        entering={FadeInLeft.delay(150).randomDelay()}
        onPress={onPress}
        style={styles.itemContainer}
      >
        <View
          style={[
            styles.itemCard,
            {
              backgroundColor: hasReadingToday 
                ? theme.colors.primary 
                : theme.colors.error,
            },
          ]}
        >
          <View>
            <Text style={styles.itemName}>{name}</Text>
            <Text style={styles.itemDate}>
              {t("listMeters.lastReading", {
                date: createdAt
                  ? formatDistanceToNow(new Date(createdAt), {
                      addSuffix: true,
                      locale: dateFnsLocale(i18n.resolvedLanguage),
                    })
                  : t("sync.never"),
              })}
            </Text>
          </View>
        </View>
      </AnimatedPressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 32,
    paddingBottom: 40,
  },
  headerContent: {
    width: "100%",
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  locationLabel: {
    fontWeight: "normal",
    fontStyle: "italic",
  },
  readingsCount: {
    fontSize: 16,
    color: "white",
    marginTop: 8,
  },
  sectionHeader: {
    marginTop: -12,
    backgroundColor: "#f5f5f5",
    marginBottom: 12,
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  itemContainer: {
    marginHorizontal: 12,
    marginBottom: 12,
  },
  itemCard: {
    borderRadius: 8,
    padding: 12,
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
  },
  itemDate: {
    color: "white",
    fontSize: 14,
  },
});
