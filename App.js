import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import * as Location from 'expo-location';

export default function App() {
  const [screen, setScreen] = useState('login');

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');

  const [vehicle, setVehicle] = useState('');

  const [locationLoading, setLocationLoading] = useState(false);

  // -------------------------
  // LOGIN
  // -------------------------
  const sendOTP = () => {
    if (phone.length < 9) {
      Alert.alert(
        'Phone Number',
        'කරුණාකර නිවැරදි phone number එකක් ඇතුළත් කරන්න.'
      );
      return;
    }

    Alert.alert(
      'OTP Sent',
      'Demo OTP: 123456'
    );

    setScreen('otp');
  };

  // -------------------------
  // OTP
  // -------------------------
  const verifyOTP = () => {
    if (otp === '123456') {
      setScreen('home');
    } else {
      Alert.alert(
        'Invalid OTP',
        'Demo එකේ OTP එක 123456'
      );
    }
  };

  // -------------------------
  // GPS
  // -------------------------
  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'GPS භාවිතා කිරීමට Location permission ලබා දෙන්න.'
        );
        setLocationLoading(false);
        return;
      }

      const location =
        await Location.getCurrentPositionAsync({});

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      setPickup(
        `GPS Location\nLat: ${latitude.toFixed(
          6
        )}\nLng: ${longitude.toFixed(6)}`
      );

      setLocationLoading(false);

      setScreen('destination');
    } catch (error) {
      setLocationLoading(false);

      Alert.alert(
        'GPS Error',
        'Location ලබාගැනීමට නොහැකි වුණා.'
      );
    }
  };

  // -------------------------
  // BOOK RIDE
  // -------------------------
  const bookRide = () => {
    if (!pickup) {
      Alert.alert(
        'Pickup Required',
        'Pickup location එක තෝරන්න.'
      );
      return;
    }

    if (!destination) {
      Alert.alert(
        'Destination Required',
        'Destination එක ඇතුළත් කරන්න.'
      );
      return;
    }

    if (!vehicle) {
      Alert.alert(
        'Vehicle Required',
        'Vehicle එකක් තෝරන්න.'
      );
      return;
    }

    Alert.alert(
      'Ride Booked',
      `Pickup: ${pickup}\n\nDestination: ${destination}\n\nVehicle: ${vehicle}\n\nDriver search කරනවා...`
    );
  };

  // -------------------------
  // LOGIN SCREEN
  // -------------------------
  if (screen === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.logo}>MY RIDE</Text>

          <Text style={styles.title}>
            Customer Login
          </Text>

          <Text style={styles.label}>
            Phone Number
          </Text>

          <TextInput
            style={styles.input}
            placeholder="07XXXXXXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={sendOTP}
          >
            <Text style={styles.buttonText}>
              GET OTP
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // -------------------------
  // OTP SCREEN
  // -------------------------
  if (screen === 'otp') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.logo}>MY RIDE</Text>

          <Text style={styles.title}>
            Verify OTP
          </Text>

          <Text style={styles.info}>
            OTP sent to {phone}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter 6 digit OTP"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={verifyOTP}
          >
            <Text style={styles.buttonText}>
              VERIFY OTP
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // -------------------------
  // HOME SCREEN
  // -------------------------
  if (screen === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>
            MY RIDE
          </Text>

          <Text style={styles.headerSub}>
            Customer App
          </Text>
        </View>

        <View style={styles.home}>
          <Text style={styles.bigTitle}>
            Where are you going?
          </Text>

          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => setScreen('pickup')}
          >
            <Text style={styles.locationButtonText}>
              📍 Set Pickup Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
          >
            {locationLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.locationButtonText}>
                📡 Use Current GPS Location
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // -------------------------
  // PICKUP SCREEN
  // -------------------------
  if (screen === 'pickup') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>
            Pickup Location
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Pickup location"
            value={pickup}
            onChangeText={setPickup}
          />

          <TouchableOpacity
            style={styles.gpsButton}
            onPress={getCurrentLocation}
          >
            <Text style={styles.buttonText}>
              📡 Use GPS Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (!pickup) {
                Alert.alert(
                  'Required',
                  'Pickup location එක ඇතුළත් කරන්න.'
                );
                return;
              }

              setScreen('destination');
            }}
          >
            <Text style={styles.buttonText}>
              CONTINUE
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // -------------------------
  // DESTINATION SCREEN
  // -------------------------
  if (screen === 'destination') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>
            Where do you want to go?
          </Text>

          <Text style={styles.label}>
            Pickup
          </Text>

          <View style={styles.locationBox}>
            <Text>{pickup || 'Not selected'}</Text>
          </View>

          <Text style={styles.label}>
            Destination
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter destination"
            value={destination}
            onChangeText={setDestination}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (!destination) {
                Alert.alert(
                  'Required',
                  'Destination එක ඇතුළත් කරන්න.'
                );
                return;
              }

              setScreen('vehicle');
            }}
          >
            <Text style={styles.buttonText}>
              SELECT VEHICLE
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // -------------------------
  // VEHICLE SCREEN
  // -------------------------
  if (screen === 'vehicle') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>
            Select Vehicle
          </Text>

          <TouchableOpacity
            style={[
              styles.vehicle,
              vehicle === 'Bike' && styles.selectedVehicle,
            ]}
            onPress={() => setVehicle('Bike')}
          >
            <Text style={styles.vehicleTitle}>
              🏍️ Bike
            </Text>

            <Text style={styles.vehicleInfo}>
              Fast & affordable
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.vehicle,
              vehicle === 'Car' && styles.selectedVehicle,
            ]}
            onPress={() => setVehicle('Car')}
          >
            <Text style={styles.vehicleTitle}>
              🚗 Car
            </Text>

            <Text style={styles.vehicleInfo}>
              Comfortable ride
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.vehicle,
              vehicle === 'Van' && styles.selectedVehicle,
            ]}
            onPress={() => setVehicle('Van')}
          >
            <Text style={styles.vehicleTitle}>
              🚐 Van
            </Text>

            <Text style={styles.vehicleInfo}>
              More passengers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (!vehicle) {
                Alert.alert(
                  'Vehicle Required',
                  'Vehicle එකක් තෝරන්න.'
                );
                return;
              }

              setScreen('book');
            }}
          >
            <Text style={styles.buttonText}>
              CONTINUE
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // -------------------------
  // BOOK RIDE SCREEN
  // -------------------------
  if (screen === 'book') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>
            Confirm Your Ride
          </Text>

          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>
              🚕 Ride Details
            </Text>

            <Text style={styles.summaryText}>
              Pickup:
            </Text>

            <Text style={styles.summaryValue}>
              {pickup}
            </Text>

            <Text style={styles.summaryText}>
              Destination:
            </Text>

            <Text style={styles.summaryValue}>
              {destination}
            </Text>

            <Text style={styles.summaryText}>
              Vehicle:
            </Text>

            <Text style={styles.summaryValue}>
              {vehicle}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={bookRide}
          >
            <Text style={styles.bookButtonText}>
              🚕 BOOK RIDE
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setScreen('vehicle')}
          >
            <Text>
              ← Change Vehicle
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

// ============================
// STYLES
// ============================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },

  logo: {
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  bigTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  info: {
    fontSize: 15,
    color: '#777',
    marginBottom: 20,
  },

  input: {
    height: 55,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },

  button: {
    height: 55,
    backgroundColor: '#111111',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  gpsButton: {
    height: 55,
    backgroundColor: '#1976d2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  header: {
    backgroundColor: '#111111',
    paddingTop: 45,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },

  headerLogo: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
  },

  headerSub: {
    color: '#cccccc',
    marginTop: 5,
  },

  home: {
    padding: 20,
  },

  locationButton: {
    height: 60,
    backgroundColor: '#111111',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  locationButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  content: {
    padding: 20,
  },

  locationBox: {
    backgroundColor: '#eeeeee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },

  vehicle: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#eeeeee',
  },

  selectedVehicle: {
    borderColor: '#111111',
  },

  vehicleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  vehicleInfo: {
    color: '#777777',
    marginTop: 5,
  },

  summary: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },

  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  summaryText: {
    color: '#777777',
    marginTop: 12,
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },

  bookButton: {
    height: 60,
    backgroundColor: '#111111',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bookButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  backButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
