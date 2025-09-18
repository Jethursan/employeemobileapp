import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "./firebase";

export default function LoginScreen({ onLogin }) {
  const [step, setStep] = useState(1); // 1 = ID, 2 = Password
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [employees, setEmployees] = useState([]);
  const [currentEmp, setCurrentEmp] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "employees"), (snapshot) => {
      setEmployees(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleIdSubmit = () => {
    const emp = employees.find((e) => e.employeeId === empId); // Correct field name
    if (emp) {
      setCurrentEmp(emp);
      setStep(2);
    } else {
      Alert.alert("Error", "Employee ID not found");
    }
  };

  const handlePasswordSubmit = () => {
    if (!currentEmp) return;

    // Robust comparison
    const empCode = String(currentEmp.emp1oyeeCode).trim();
    const inputCode = password.trim();

    console.log("Firebase emp1oyeeCode:", empCode);
    console.log("Input Code:", inputCode);

    if (empCode === inputCode) {
      onLogin(currentEmp);
    } else {
      Alert.alert("Error", "Incorrect Employee Code");
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <View style={styles.form}>
          <Text style={styles.title}>Employee Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Employee ID"
            value={empId}
            onChangeText={setEmpId}
          />
          <Button title="Next" onPress={handleIdSubmit} />
        </View>
      )}

      {step === 2 && (
        <View style={styles.form}>
          <Text style={styles.title}>
            Enter Employee Code for {currentEmp?.employeeName}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Employee Code"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Login" onPress={handlePasswordSubmit} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  form: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 20 },
});