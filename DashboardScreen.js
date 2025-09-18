import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { db } from "../firebase";

export default function DashboardScreen({ employee, onLogout }) {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      const q = query(
        collection(db, "assignments"),
        where("employeeId", "==", employee.employeeId)
      );
      const snap = await getDocs(q);
      setAssignments(snap.docs.map((doc) => doc.data()));
    };

    fetchAssignments();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome, {employee.employeeName} ({employee.employeeId})
      </Text>

      <FlatList
        data={assignments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.projectName}>{item.projectName}</Text>
            <Text>Role: {item.role}</Text>
            <Text>Duration: {item.duration}</Text>
            <Text>Description: {item.description}</Text>
          </View>
        )}
      />

      <Button title="Logout" color="red" onPress={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 20 },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  projectName: { fontSize: 16, fontWeight: "bold" },
});
