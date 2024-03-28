import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableWithoutFeedback, Modal } from 'react-native';
import { Chip } from 'react-native-paper';

const PersonChip = ({ person, onClose }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.selectedPersonContainer}>
      <TouchableWithoutFeedback onPress={toggleModal}>
        <View>
          <Chip
            style={styles.selectedPersonChip}
            avatar={renderAvatar(person.image)}
            onClose={onClose ? () => onClose(person) : null}
            textStyle={styles.chipText}
          >
            {person.name}
          </Chip>
        </View>
      </TouchableWithoutFeedback>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{person.name}</Text>
            <TouchableWithoutFeedback onPress={toggleModal}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const renderAvatar = (image) => {
  if (typeof image === 'string') {
    return <Image source={{ uri: image }} style={styles.personAvatar} />;
  } else if (image && image.uri) {
    return <Image source={{ uri: image.uri }} style={styles.personAvatar} />;
  } else {
    return <Image source={require('../../../assets/person.jpg')} style={styles.personAvatar} />;
  }
};

const styles = StyleSheet.create({
  selectedPersonContainer: {
    flexBasis: '48%',
    marginBottom: 8,
  },
  selectedPersonChip: {
    marginRight: 4,
  },
  personAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  chipText: {
    flex: 1,
    flexWrap: 'wrap',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PersonChip;
