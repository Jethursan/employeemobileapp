import { db } from '@/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HomeScreen() {
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [employee, setEmployee] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);

  // Step 1: Submit Employee ID
  const handleIdSubmit = async () => {
    if (!empId) return alert('Please enter Employee ID');

    try {
      const q = query(collection(db, 'employees'), where('employeeId', '==', empId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setEmployee(snapshot.docs[0].data());
        setStep(2);
      } else {
        alert('Employee ID not found');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching employee');
    }
  };

  // Step 2: Submit Employee Code
  const handlePasswordSubmit = async () => {
    if (!employee) return;

    const empCode = String(employee.employeeCode).trim();
    const inputCode = password.trim();

    if (empCode === inputCode) {
      // Fetch Assignment
      const assignQuery = query(collection(db, 'assignments'), where('employeeId', '==', empId));
      const assignSnap = await getDocs(assignQuery);

      if (!assignSnap.empty) {
        const assignData = assignSnap.docs[0].data();

        // Fetch Project details
        const projectRef = doc(db, 'projects', assignData.projectId);
        const projectSnap = await getDoc(projectRef);

        setAssignment({
          ...assignData,
          project: projectSnap.exists() ? projectSnap.data() : null,
        });
      }

      setStep(3);
    } else {
      alert('Incorrect Employee Code');
    }
  };

  // Step 1: Enter Employee ID
  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Employee Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Employee ID"
          value={empId}
          onChangeText={setEmpId}
        />
        <Button title="Next" onPress={handleIdSubmit} />
      </View>
    );
  }

  // Step 2: Enter Employee Code
  if (step === 2) {
    return (
      <View style={styles.container}>
        {employee ? (
          <>
            <Text style={styles.title}>Enter Employee Code for {employee.employeeName}</Text>
            <TextInput
              style={styles.input}
              placeholder="Employee Code"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button title="Login" onPress={handlePasswordSubmit} />
          </>
        ) : (
          <Text>Loading employee info...</Text>
        )}
      </View>
    );
  }

  // Step 3: Welcome Page
  if (step === 3) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {employee ? (
          <>
            <Text style={styles.title}>Welcome, {employee.employeeName}!</Text>
            <Text style={styles.label}>Employee ID: {employee.employeeId}</Text>
            <Text style={styles.label}>Phone: {employee.employeePhone || 'N/A'}</Text>

            {assignment ? (
              <>
                <Text style={styles.label}>
                  Assigned Project: {assignment.project?.projectName || 'N/A'}
                </Text>
                <Text style={styles.label}>Role: {assignment.role || 'N/A'}</Text>
                <Text style={styles.label}>
                  Duration: {assignment.project?.projectDuration || 'N/A'}
                </Text>
              </>
            ) : (
              <Text>No project assigned</Text>
            )}

            <Button
              title="Logout"
              onPress={() => {
                setStep(1);
                setEmpId('');
                setPassword('');
                setEmployee(null);
                setAssignment(null);
              }}
            />
          </>
        ) : (
          <Text>Loading employee info...</Text>
        )}
      </ScrollView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
});
