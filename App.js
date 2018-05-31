import React from 'react';
import { StyleSheet, Text, View, StatusBar, Modal, Dimensions, ScrollView } from 'react-native';
import { List, ListItem, FormLabel, FormInput, FormValidationMessage, Button, SearchBar, Badge } from 'react-native-elements'


const {height, width} = Dimensions.get('window');

export default class App extends React.Component {

  

  // Life Cicle

  componentDidMount() {
    StatusBar.setBackgroundColor('#000');
  };

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

    addModalVisible: false
  }

  filter = text => {
    var list = this.state.list
    var filtered_list = []
    if ( text == "" ) {
      filtered_list = list
    } else {

      list.map(item => {
        if ( item.name.includes(text) ) {
          filtered_list.push(item)
        }
      })

    }

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

  submit = () => {
    if ( this.validation() ) {
      let total = this.state.total
      total = total + (this.state.quantity * this.state.price)
      this.setState({
        list: [
          {name: this.state.product, quantity: this.state.quantity, price: this.state.price}, 
          ...this.state.list
        ],

        filtered_list: [
          {name: this.state.product, quantity: this.state.quantity, price: this.state.price}, 
          ...this.state.list
        ],

        total
      },
        callback= () => {this.setState({addModalVisible: false})}
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
        
        <SearchBar
          round
          clearIcon
          onChangeText={text => this.filter(text)}
          onClearText={() => this.setState({filtered_list: this.state.list}) }
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
                  title={l.name}
                  titleStyle={styles.item_text}
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
    