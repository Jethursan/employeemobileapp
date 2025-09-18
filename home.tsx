import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { db } from "../firebase";

export default function HomeScreen() {
  const { employeeId } = useLocalSearchParams();
  const [projects, setProjects] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(db, "assignments"), where("employeeId", "==", employeeId));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    };

    fetchProjects();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Projects</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.project}>{item.projectName}</Text>
            <Text>Role: {item.role}</Text>
            <Text>Duration: {item.duration}</Text>
          </View>
        )}
      />
      <Button title="Logout" onPress={() => router.replace("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20, textAlign: "center" },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  project: { fontSize: 18, fontWeight: "bold" },
});
