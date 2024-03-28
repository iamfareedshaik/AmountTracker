import React, { memo, useCallback } from 'react';
import { Modal, TouchableOpacity, Text, TextInput, StyleSheet, View, Animated } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const ModalComponent = memo(({ isVisible, closeModal, handleConfirm, item, selectedUnit, setSelectedUnit, quantity, setQuantity }) => {
  const handleConfirmAndClose = useCallback(() => {
    handleConfirm(item);
    closeModal();
  }, [handleConfirm, item, closeModal]);

  return (
    <Modal transparent visible={isVisible} onRequestClose={closeModal} key="modalKey">
      <Animated.View style={[styles.modalContainer]}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.itemName}>{item.name}</Text>
          <TextInput
            style={styles.quantityInput}
            placeholder="Enter Quantity"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
          <RNPickerSelect
            style={styles.unitPicker}
            value={selectedUnit}
            onValueChange={setSelectedUnit}
            items={[
              { label: 'kg', value: 'kg' },
              { label: 'g', value: 'g' },
              { label: 'lb', value: 'lb' },
              { label: 'qty', value: 'qty' },
            ]}
          />
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmAndClose}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    position: 'relative',
    padding: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 20,
    color: 'black',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantityInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  unitPicker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#77DD77',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ModalComponent;
