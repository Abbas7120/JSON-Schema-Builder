import {useState} from 'react'
import {Input,Select,Switch,Button,Card,Space} from 'antd'
const {Option}=Select
const defaultField=()=>({
  name:'',
  type:'string',
  children:[],
  showChildren:true,
})
const JSONBuilder = () => {

   const [fields,setFields]=useState([defaultField()]);
  const updateField=(path,key,value)=>{
    const updated= [...fields]
    let ref=updated
    for(let i=0;i<path.length-1;i++){
      ref=ref[path[i]].children;
    }
    ref[path[path.length-1]][key]=value;
    if(key==='type' &&  value!=='nested'){
      ref[path[path.length-1]].children=[]
    }
    setFields(updated)
  }
 
  const addField=(path=[])=>{
    const updated=[...fields]
    let ref=updated;
    for(let i=0;i<path.length;i++){
      ref=ref[path[i]].children
    }
    ref.push(defaultField())
    setFields(updated)
  }
  const removeField=(path)=>{
const updated=[...fields]
let ref=updated;
for(let i=0;i<path.length-1;i++){
  ref=ref[path[i]].children;
}
ref.splice(path[path.length-1],1);
setFields(updated)

  }
 
  const renderFields=(fields,path=[])=>{
    return fields.map((field,index)=>{
      const currentPath=[...path,index]
      return (
          <Card key={currentPath.join('-')} style={{ marginBottom: 10, backgroundColor: '#fafafa' }}>
             <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} wrap>
        <Input placeholder='field name' value={field.name} 
        onChange={(e)=>updateField(currentPath,'name',e.target.value)}  
          style={{ width: 150 }}
            />
            <Select
            value={field.type}
            onChange={(value)=>updateField(currentPath,'type',value)}
            style={{width:120}}>
                          <Option value="string">string</Option>
              <Option value="number">number</Option>
              <Option value="nested">nested</Option>
</Select>
{field.type==='nested' && (<Switch checked={field.showChildren}
onChange={(checked) =>updateField(currentPath,'showChildren',checked)}/>)}
<Button danger onClick={()=>removeField(currentPath)}>x</Button>
          </Space>
          {field.type==='nested' && field.showChildren && (
            <div style={{ paddingLeft: 20, marginTop: 10 }}>
              {renderFields(field.children, currentPath)}
              <Button type="dashed" onClick={() => addField(currentPath)} style={{ marginTop: 10 }}>
                + Add Item
              </Button>    </div>
          )}
         </Card>
      )
    })
  }
  const generateSchema=(fields)=>{
const result={}
fields.forEach((field)=>{
  if(!field.name) return ;
  if(field.type==='nested'){
result[field.name]=generateSchema(field.children)
  }
  else {
result[field.name]=field.type.toUpperCase()
  }
})
  return result;}
  return (
    <div style={{display:'flex',padding:20,gap:40}}>
      <div style={{flex:1}}>
        {renderFields(fields)}
<Button type="primary" onClick={()=>addField([])}>
  +Add Item
</Button>
<Button type="default" style={{marginLeft:17,marginTop:10}}>
  Submit
</Button>
      </div>
      <Card title="JSON Builder Schema" style={{width:400}}>
        <pre>{JSON.stringify(generateSchema(fields),null,2)}</pre>
      </Card>
    </div>
  )
}

export default JSONBuilder


