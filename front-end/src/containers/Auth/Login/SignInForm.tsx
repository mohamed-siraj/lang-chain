import { Flex, FormControl, FormLabel, Input, Button, Divider, AbsoluteCenter, Box, Link } from '@chakra-ui/react'
import { InputStyles } from '../../../styles/components'
import { Text } from '../../../components/Text';
import { FcGoogle } from 'react-icons/fc';

const SignInForm = () => {    
    const handleGoogleLogin = ()=>{
        window.location.replace(`${import.meta.env.VITE_API_AUTH_BASE_URL}`)
    }

    return (
        <Flex w="100%" textAlign="left" direction="column" gap={4} px={10} mt={40}>
            <Text type="display" fontSize={{ base: '20', lg: '32' }}>
                Login to your account
            </Text>

            <Flex direction="column" gap={4} color="gray.900" boxSize={{ base: "100%", lg: "360px" }}>
                <FormControl>
                    <FormLabel htmlFor='username' fontSize={{ base: '14', lg: '16' }}>Username</FormLabel>
                    <Input id='username' name='username' type='text' placeholder='Enter your username' style={InputStyles} />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor='password' fontSize={{ base: '14', lg: '16' }}>Password</FormLabel>
                    <Input id='password' name='password' type='password' placeholder='Enter your password' style={InputStyles} />
                </FormControl>
                <Button variant="primary" w="100%" mt="10px"  lineHeight={2} >Login</Button>
                <Box position='relative' padding='5'>
                    <Divider />
                    <AbsoluteCenter bg="white" color="gray.400" fontWeight="normal">
                        or
                    </AbsoluteCenter>
                </Box>
                <Button variant="secondary" w="100%" mt="10px" lineHeight={2} leftIcon={<FcGoogle />} onClick={handleGoogleLogin}> Signup with Google </Button>
                <Text textAlign="center" mt="10px" fontFamily="IBM Plex Sans">
                    Don’t have an account? <Link color='teal.500' href='/signup'> Create one </Link>
                </Text>
            </Flex>
        </Flex>
    )
}

export default SignInForm