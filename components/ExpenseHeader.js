import React,{useEffect,useState} from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useData } from "../app/context/DataContext";
import { http } from "../Api";
const ExpenseHeader = ({ navigation }) => {
  const { updateData, updateSplitType } = useData();
  const [mydetails,setmyDetails] = useState()

  useEffect(() => {
    (async () => {
      try {
        const response = await http.get('/me');
        const data = response.data;
        setmyDetails(data.user);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, []);  

  const handleCreateExpense = () => {
    updateData([mydetails]);
    updateSplitType('Equally');
    navigation.navigate("Expenses Tracker");
  };

  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={handleCreateExpense}
    >
      <Text style={styles.buttonText}>Split Expenses</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginRight: 15,
    backgroundColor: "#00ddeb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ExpenseHeader;
