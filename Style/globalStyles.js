import { StyleSheet } from "react-native";
export const gobalStyles = StyleSheet.create({
    header: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginVertical: 16,
      color: "#333",
    },
    itemContainer: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 16,
      margin: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    itemImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 16,
      resizeMode: "contain"
    },
    itemInfoContainer: {
      flex: 1,
    },
    itemName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    itemDescription: {
      fontSize: 14,
      color: "#666",
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    itemCount: {
      marginHorizontal: 16,
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    folderContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      folderImage: {
        width: 80,
        height: 80,
        borderRadius: 8, 
        marginRight: 16,
        resizeMode: "contain",
      },
      folderName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
      },
  });
