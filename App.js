import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
export default function App(){
const [s,setS]=useState(1);
return(
<ScrollView style={{padding:30,backgroundColor:'#fff'}}>
<Text style={{fontSize:28,fontWeight:'900',textAlign:'center',marginTop:30}}>MACHINEGO</Text>
<Text style={{textAlign:'center',marginBottom:20}}>System {s}/8</Text>
{s==1&&<View><Text>1.Customer Entry - Vehicle Garage</Text><TouchableOpacity onPress={()=>setS(2)} style={{backgroundColor:'black',padding:15,marginTop:20}}><Text style={{color:'white'}}>Next →</Text></TouchableOpacity></View>}
{s==2&&<View><Text>2.Vehicle Details</Text><TouchableOpacity onPress={()=>setS(3)} style={{backgroundColor:'black',padding:15,marginTop:20}}><Text style={{color:'white'}}>Next →</Text></TouchableOpacity></View>}
{s==3&&<View><Text>3.Diagnosis</Text><TouchableOpacity onPress={()=>setS(4)} style={{backgroundColor:'black',padding:15,marginTop:20}}><Text style={{color:'white'}}>Next →</Text></TouchableOpacity></View>}
{s==4&&<View><Text>4.Estimate</Text><TouchableOpacity onPress={()=>setS(5)} style={{backgroundColor:'black',padding:15,marginTop:20}}><Text style={{color:'white'}}>Next →</Text></TouchableOpacity></View>}
{s==5&&<View><Text>5.Job Card</Text><TouchableOpacity onPress={()=>setS(6)} style={{backgroundColor:'black',padding:15,marginTop:20}}><Text style={{color:'white'}}>Next →</Text></TouchableOpacity></View>}
{s==6&&<View><Text>6.Work Progress</Text><TouchableOpacity onPress={()=>setS(7)} style={{backgroundColor:'black',padding:15,marginTop:20}}><Text style={{color:'white'}}>Next →</Text></TouchableOpacity></View>}
{s==7&&<View><Text>7.Billing - NEW</Text><TouchableOpacity onPress={()=>setS(8)} style={{backgroundColor:'black',padding:15,marginTop:20}}><Text style={{color:'white'}}>Next →</Text></TouchableOpacity></View>}
{s==8&&<View><Text>8.Delivery - DONE! NEW</Text><TouchableOpacity onPress={()=>setS(1)} style={{backgroundColor:'green',padding:15,marginTop:20}}><Text style={{color:'white'}}>Restart App</Text></TouchableOpacity></View>}
</ScrollView>
);}
