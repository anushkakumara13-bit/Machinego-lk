import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [step, setStep] = useState('login');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [realOtp, setRealOtp] = useState('');
  const [city, setCity] = useState('Getting GPS...');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [service, setService] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status!== 'granted') { setCity('Colombo'); return; }
      let loc = await Location.getCurrentPositionAsync({});
      let rev = await Location.reverseGeocodeAsync(loc.coords);
      if (rev[0]) setCity(rev[0].city || rev[0].district || 'Colombo');
    })();
  }, []);

  const sendOtp = () => {
    if(phone.length < 9){ Alert.alert('Phone වැරදියි'); return; }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRealOtp(code);
    Alert.alert('OTP Code', code);
    setStep('otp');
  }
  const verifyOtp = () => {
    if(otp === realOtp) setStep('form');
    else Alert.alert('OTP වැරදියි');
  }

  if(step==='login'){
    return(<View style={styles.c}><Text style={styles.t}>Machinego.lk</Text><Text>GPS: {city}</Text><TextInput style={styles.i} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad"/><Button title="Send OTP" onPress={sendOtp}/></View>)
  }
  if(step==='otp'){
    return(<View style={styles.c}><Text style={styles.t}>Enter OTP</Text><TextInput style={styles.i} placeholder="OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad"/><Button title="Verify OTP" onPress={verifyOtp}/></View>)
  }
  return(
    <ScrollView contentContainerStyle={styles.c}>
      <Text style={styles.t}>Book Service - {city}</Text>
      <TextInput style={styles.i} placeholder="Full Name" value={name} onChangeText={setName}/>
      <TextInput style={styles.i} placeholder="Full Address" value={address} onChangeText={setAddress}/>
      <TextInput style={styles.i} placeholder="Service Type (ex: AC Repair)" value={service} onChangeText={setService}/>
      <Button title="Confirm Booking" onPress={()=>Alert.alert('Success', `${name} - ${city} booked!`)}/>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  c:{flexGrow
