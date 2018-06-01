import React from 'react';
import { StyleSheet, Text, View, StatusBar, Modal, Dimensions, ScrollView, Alert, AsyncStorage } from 'react-native';
import { List, ListItem, FormLabel, FormInput, FormValidationMessage, Button, SearchBar, Badge } from 'react-native-elements'


const {height, width} = Dimensions.get('window');


export default class App extends React.Component {

  async componentWillMount() {
    try {
      const value = await AsyncStorage.getItem('@shopping_list:state');
      if (value !== null){
        this.setState({value})
      }
    } catch (error) {
      console.log(error)
    }
  }

  componentDidMount() {
    StatusBar.setBackgroundColor('#000');
    this.filter('');
  };

  async componentWillUnmount() {
    try {
      await AsyncStorage.setItem('@shopping_list:state', this.state);
      console.log(this.state)
    } catch (error) {
      console.log(error)
    }
  }

  state = {
    product: "",
    product_error: "",
    quantity: "",
    quantity_error: "",
    price: "",
    price_error: "",

    total: 0,

    list: [],
    filtered_list: [],

    addModalVisible: false,
    editModalVisible: false,

    editing_key: null
  }

  promisedSetState = (newState) => {
    return new Promise((resolve) => {
        this.setState(newState, () => {
            resolve()
        });
    });
  }

  openEditModal = (index, product, quantity, price) => {
    this.setState(
      {product, quantity, price},
      this.setState({editModalVisible: true, editing_key: index})      
    )
  }

  confirmDelete = index => {
    Alert.alert(
      'Cuidado',
      'Deseja deletar este item?',
      [
        {text: 'Cancelar', onPress: () => {}, style: 'cancel'},
        {text: 'Deletar', onPress: () => this.delete(index)},
      ],
      { cancelable: true }
    )
  }

  onSwitch = (index, active) => {
    this.teste()
    var list = this.state.list
    filtered_list = this.state.filtered_list
    list[filtered_list[index].index].active = active
    filtered_list[index].active = active
    console.log(list, filtered_list)
    this.setState(
      {list, filtered_list},
      callback= () => {
        this.setState({editModalVisible: false})
        this.sum_total()
      }
    ) 
  }

  teste = () => {
    var list = this.state.list
    var filtered_list = []
    list.map((item, index) => {
      filtered_list.push({...item, index})
    })
    this.promisedSetState({filtered_list})
  }
  

  filter = text => {
    //this.teste()
    var list = this.state.list
    var filtered_list = []
    list.map((item, index) => {
      if ( item.name.includes(text) ) {
        filtered_list.push({...item, index})
      }
    })
    this.setState({filtered_list})
  }

  validation = () => {
    let valid = false

    if (this.state.product == '') {
      this.setState({product_error: 'Preencha o nome do produto.'})
    } else if (this.state.quantity == '') {
      this.setState({quantity_error: 'Preencha a quantidade do produto.'})
    } else if (this.state.price == '') {
      this.setState({price_error: 'Preencha o preço do produto.'})
    } else {
      valid = true
    }   
    
    if ( valid ) {
      this.setState({
        product: '',
        quantity: '',
        price: '',
        product_error: '', 
        quantity_error: '', 
        price_error: ''
      })      
    }
    return valid
  }

  sum_total = () => {
    let total = 0
    this.state.list.map(product => {
      if (product.active) {
        total = total + (product.quantity * product.price)
      }
    })
    total = parseFloat(Math.round(total * 100) / 100).toFixed(2)
    this.setState({total})
  }

  delete = index => {
    list = this.state.list
    filtered_list = this.state.filtered_list

    list.splice(filtered_list[index].index, 1)    
    filtered_list.splice(index, 1);
    this.setState(
      {list, filtered_list},
      callback=this.sum_total
    ) 
  }

  edit = index => {
    if ( this.validation() ) {
      list = this.state.list      
      filtered_list = this.state.filtered_list        

      list[ filtered_list[index].index ] = {name: this.state.product, quantity: this.state.quantity, price: this.state.price, active: this.state.filtered_list[index].active}
      filtered_list[index] = {name: this.state.product, quantity: this.state.quantity, price: this.state.price, active: this.state.filtered_list[index].active, index: filtered_list[index].index}
      this.setState(
        {list, filtered_list},
        callback= () => {
          this.setState({editModalVisible: false})
          this.sum_total()
        }
      ) 
    }
  }

  submit = () => {
    if ( this.validation() ) {
      this.setState({
        list: [
          {name: this.state.product, quantity: this.state.quantity, price: this.state.price, active: true}, 
          ...this.state.list
        ],

        filtered_list: [
          {name: this.state.product, quantity: this.state.quantity, price: this.state.price, active: true}, 
          ...this.state.list
        ],
      },
        callback= () => {
          this.setState({addModalVisible: false}) 
          this.sum_total()
        }
      ) 
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#000"
          barStyle="light-content"
        />

        {/* Add Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.addModalVisible}
          onRequestClose={() => {}}
          >

          <View style={styles.modal_container}>

            <Text style={styles.title}>Adicionar produto</Text>

            <View>
              <FormLabel labelStyle={styles.label_style} >Produto</FormLabel>
              <FormInput 
                onChangeText={(product) => this.setState({product})} 
                containerStyle={styles.input_container_style} 
                inputStyle={{ color: '#FFF' }}
              />
              <FormValidationMessage>{this.state.product_error}</FormValidationMessage>

              <FormLabel labelStyle={styles.label_style} >Quantidade</FormLabel>
              <FormInput 
                keyboardType={'numeric'} 
                onChangeText={(quantity) => this.setState({quantity})} 
                containerStyle={styles.input_container_style} 
                inputStyle={{ color: '#FFF' }}
              />
              <FormValidationMessage>{this.state.quantity_error}</FormValidationMessage>

              <FormLabel labelStyle={styles.label_style} >Preço</FormLabel>
              <FormInput 
                keyboardType={'numeric'} 
                onChangeText={(price) => this.setState({price})} 
                containerStyle={styles.input_container_style} 
                inputStyle={{ color: '#FFF' }}
              />
              <FormValidationMessage>{this.state.price_error}</FormValidationMessage>

            </View>

            <View style={styles.inline}>
              <Button
                title='Voltar' 
                onPress={() => this.setState({addModalVisible: false})}
              />
              <Button
                title='Adicionar' 
                onPress={this.submit}
              />
            </View>


          </View>

        </Modal>

        {/* Edit Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.editModalVisible}
          onRequestClose={() => {}}
          >

          <View style={styles.modal_container}>

            <Text style={styles.title}>Editar produto</Text>

            <View>
              <FormLabel labelStyle={styles.label_style} >Produto</FormLabel>
              <FormInput
                value={this.state.product} 
                onChangeText={product => this.setState({product})} 
                containerStyle={styles.input_container_style} 
                inputStyle={{ color: '#FFF' }}
              />
              <FormValidationMessage>{this.state.product_error}</FormValidationMessage>

              <FormLabel labelStyle={styles.label_style} >Quantidade</FormLabel>
              <FormInput 
                value={this.state.quantity} 
                keyboardType={'numeric'} 
                onChangeText={quantity => this.setState({quantity})} 
                containerStyle={styles.input_container_style} 
                inputStyle={{ color: '#FFF' }}
              />
              <FormValidationMessage>{this.state.quantity_error}</FormValidationMessage>

              <FormLabel labelStyle={styles.label_style} >Preço</FormLabel>
              <FormInput 
                value={this.state.price} 
                keyboardType={'numeric'} 
                onChangeText={price => this.setState({price})} 
                containerStyle={styles.input_container_style} 
                inputStyle={{ color: '#FFF' }}
              />
              <FormValidationMessage>{this.state.price_error}</FormValidationMessage>

            </View>

            <View style={styles.inline}>
              <Button
                title='Voltar' 
                onPress={() => this.setState({editModalVisible: false})}
              />
              <Button
                title='Salvar' 
                onPress={() => this.edit(this.state.editing_key)}
              />
            </View>


          </View>

        </Modal>


        <SearchBar
          round
          clearIcon
          onChangeText={text => this.filter(text)}
          onClearText={() => this.filter('') }
          placeholder='Pesquise aqui...' 
        />

        <View style={[styles.inline, {marginTop: 10}]}>
          <View>
            <Text style={[styles.item_text, {textAlign: 'center', marginBottom: 5}]}>Produtos</Text>
            <Badge
              value={this.state.list.length}
            />
          </View>

          <View>
            <Text style={[styles.item_text, {textAlign: 'center', marginBottom: 5}]}>Total</Text>
            <Badge
              value={`R$ ${this.state.total}`}
            />
          </View>

        </View>

        <ScrollView>
          <List containerStyle={styles.list_container}>
            {
              this.state.filtered_list.map((l, i) => (
                <ListItem
                  key={i}
                  onPress={() => this.openEditModal(i, l.name, l.quantity, l.price)}
                  hideChevron 
                  switchButton
                  onSwitch={active => this.onSwitch(i, active) }
                  switched={l.active}
                  switchOnTintColor='rgba(77, 184, 254, 0.3)'
                  switchThumbTintColor='#4DB8FE'
                  title={l.name}
                  titleStyle={styles.item_text}
                  rightTitle={`R$ ${parseFloat( Math.round( ( l.quantity * l.price ) * 100 ) / 100 ).toFixed(2)}`}
                  rightTitleStyle={styles.item_text}
                  onLongPress={() => this.confirmDelete(i)}
                />
              ))
            }
          </List>
        </ScrollView>

        <Button
          title='ADICIONAR' 
          buttonStyle={{ marginBottom: 10 }}
          onPress={() => this.setState({addModalVisible: true})}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#393E42',
    marginTop: StatusBar.currentHeight
  },

  list_container: {
    flex: 1,
    backgroundColor: '#393E42',
  },

  item_container: {
    flexDirection: "row",
    justifyContent: "space-around"
  },

  item_text: {
    color: '#4DB8FE',
  },

  modal_container: {
    flex: 1,
    backgroundColor: '#393E42',
    justifyContent: 'space-around'
  },

  title: {
    color: '#4DB8FE',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 25
  },

  label_style: {
    color: '#4DB8FE',
  },

  input_container_style: {
    borderBottomWidth: 2,
    borderColor: '#4DB8FE',
  },

  inline: {
    flexDirection: "row",
    justifyContent: "space-around"
  },

});
    