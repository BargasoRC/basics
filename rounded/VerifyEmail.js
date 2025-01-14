import React, { Component } from 'react';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { View , TextInput , Image, TouchableHighlight, Text, ScrollView, Dimensions} from 'react-native';
import Style from './../Style.js';
import { Spinner } from 'components';
import Api from 'services/api/index.js';
import { Routes, Color, Helper, BasicStyles } from 'common';
import CustomError from 'components/Modal/Error.js';
import PasswordWithIcon from 'components/InputField/Password.js';
import Header from './../HeaderWithoutName';
import config from 'src/config';
import Button from 'components/Form/Button';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class Register extends Component {
  //Screen1 Component
  constructor(props){
    super(props);
    this.state = {
        isResponseError: false,
        isLoading: false,
        errorMessage: false
    };
  }
  
  componentDidMount(){
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  }
  
  submit(){
    const { username, email, password } = this.state;
    if(this.validate() == false){
      return
    }
    let parameter = {
      username: username,
      email: email,
      password: password,
      config: null,
      account_type: 'USER',
      referral_code: null,
      status: 'ADMIN'
    }
    this.setState({isLoading: true})
    Api.request(Routes.accountCreate, parameter, response => {
      this.setState({isLoading: false})
      if(response.error !== null){
        if(response.error.status === 100){
          let message = response.error.message
          if(typeof message.username !== undefined && typeof message.username !== 'undefined'){
            this.setState({errorMessage: message.username[0]})
          }else if(typeof message.email !== undefined && typeof message.email !== 'undefined'){
            this.setState({errorMessage: message.email[0]})
          }
        }else if(response.data !== null){
          if(response.data > 0){
            this.redirect('loginStack')
          }
        }
      }
    }, error => {
      this.setState({isResponseError: true})
    })
  }

  validate(){
    const { username, email, password, confirmPassword } = this.state;
    if(username.length >= 6 &&
      email !== '' &&
      password !== '' &&
      password.length >= 6 &
      password.localeCompare(confirmPassword) === 0 &&
      Helper.validateEmail(email) === true){
      return true
    }else if(email !== '' && Helper.validateEmail(email) === false){
      this.setState({errorMessage: 'You have entered an invalid email address.'})
      return false
    }else if(username !== '' && username.length < 6){
      this.setState({errorMessage: 'Username must be atleast 6 characters.'})
      return false
    }else if(password !== '' && password.length < 6){
       this.setState({errorMessage: 'Password must be atleast 6 characters.'})
       return false
    }else if(password !== '' && password.localeCompare(confirmPassword) !== 0){
       this.setState({errorMessage: 'Password did not match.'})
       return false
    }else{ 
      this.setState({errorMessage: 'Please fill in all required fields.'})
      return false
    }
  }

  render() {
    const { isLoading, errorMessage, isResponseError } = this.state;
    const { theme } = this.props.state;
    return (
      <ScrollView style={{
        backgroundColor: theme ? theme.primary : Color.primary
      }}
      showsVerticalScrollIndicator={false}>
        <View style={{
          flex: 1
        }}>
          <Header params={"Verify Email"}></Header>
            <View style={{
              backgroundColor: Color.white,
              width: '100%',
              height: height,
              paddingTop: 50,
              marginTop: 10,
              borderTopLeftRadius: 60,
              borderTopRightRadius: 60,
              ...BasicStyles.loginShadow
            }}>
              <Text style={{
                width: '100%',
                textAlign: 'center',
                paddingBottom: 20,
                fontSize: BasicStyles.standardFontSize,
                fontWeight: 'bold',
                color: theme ? theme.primary : Color.primary
              }}>Verification</Text>
                {
                  errorMessage != null && (
                    <View style={{
                      flexDirection: 'row',
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingLeft: '20%'
                    }}>
                      <Text style={{
                        ...Style.messageText,
                        fontSize: BasicStyles.standardFontSize,
                        fontWeight: 'bold'
                      }}>Oops! </Text>
                      <Text style={{
                        ...Style.messageText,
                        fontSize: BasicStyles.standardFontSize
                      }}>{errorMessage}</Text>
                    </View>
                  )
                }
                
                
                <View style={Style.TextContainerRounded}>

                  <Button
                    onClick={() => this.submit()}
                    title={'Register'}
                    style={{
                      backgroundColor: theme ? theme.secondary : Color.secondary,
                      width: '100%',
                      marginBottom: 20
                    }}
                  />

                  <View style={{
                    height: 1,
                    backgroundColor: Color.gray
                  }}>
                  </View>

                  <View style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      color: Color.gray
                    }}>Have an account Already?</Text>
                  </View>

                  <Button
                    onClick={() => this.redirect('loginStack')}
                    title={'Login Now!'}
                    style={{
                      backgroundColor: Color.warning,
                      width: '100%',
                      marginBottom: 100
                    }}
                  />
                </View>
            </View>
        </View>

        {isLoading ? <Spinner mode="overlay"/> : null }
        {isResponseError ? <CustomError visible={isResponseError} onCLose={() => {
          this.setState({isResponseError: false, isLoading: false})
        }}/> : null}
      </ScrollView>
    );
  }
}
 
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    login: (user, token) => dispatch(actions.login(user, token)),
    logout: () => dispatch(actions.logout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);
