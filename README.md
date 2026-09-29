import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [s, setS] = useState(1);
  return (
    <ScrollView style={{padding:40,backgroundColor:'#fff'}}>
      <Text style={{fontSize:30,fontWeight:'900',textAlign:'center',marginTop:20}}>MACHINEGO</Text>
      <Text style={{textAlign:'center',marginBottom:20}}>System {s} / 8</Text>
      {s==1 && <View><Text>System 1: Customer Entry</Text><TouchableOpacity onPress={()=>setS(2)} style={{backgroundColor:'black',padding:15,marginTop:20}}><Text style={{color:'white'}}>Next</Text></TouchableOpacity></View>}
      {s==2 && <View><Text>System 2: Vehicle</Text><TouchableOpacity onPress={()=>setS(3)} style={{backgroundColor:'black',padding:15,marginTop:20}}><Text style={{color:'white'}}>Next</Text></TouchableOpacity></View>}
      {s==3 && <View><Text>System 3: Diagnosis</Text><TouchableOpacity onPress={()=>setS(4)} style={{backgroundColor:'black',padding:15,marginTop:20}}><Text style={{color:'white'}}>Next</Text></TouchableOpacity></View>}
      {s==4 && <View><Text>System 4: Estimate</Text><TouchableOpacity onPress={()=>setS(5)} style={{backgroundColor:'black',padding:15,marginTop:20}}><Text style={{color:'white'}}>Next</Text></TouchableOpacity></View>}
      {s==5 && <View><Text>System 5: Job Card</Text><TouchableOpacity onPress={()=>setS(6)} style={{backgroundColor:'black',padding:15,marginTop:20}}><Text style={{color:'white'}}>Next</Text></TouchableOpacity></View>}
      {s==6 && <View><Text>System 6: Work Progress</Text><TouchableOpacity onPress={()=>setS(7)} style={{backgroundColor:'black',padding:15,marginTop:20}}><Text style={{color:'white'}}>Next</Text></TouchableOpacity></View>}
      {s==7 && <View><Text>System 7: Billing</Text><TouchableOpacity onPress={()=>setS(8)} style={{backgroundColor:'black',padding:15,marginTop:20}}><Text style={{color:'white'}}>Next</Text></TouchableOpacity></View>}
      {s==8 && <View><Text>System 8: Delivery - DONE!</Text><TouchableOpacity onPress={()=>setS(1)} style={{backgroundColor:'green',padding:15,marginTop:20}}><Text style={{color:'white'}}>Restart</Text></TouchableOpacity></View>}
    </ScrollView>
  );
}
