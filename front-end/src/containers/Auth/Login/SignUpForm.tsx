import { Flex, FormControl, FormLabel, Input, Button, Divider, AbsoluteCenter, Box, Link } from '@chakra-ui/react'
import { InputStyles } from '../../../styles/components'
import { Text } from '../../../components/Text';
import { FcGoogle } from 'react-icons/fc';

const SignUpForm = () => {
    return (
        <Flex w="100%" textAlign="left" direction="column" gap={4} px={10} mt={20}>
            <Text type="display" fontSize={{ base: '20', lg: '32' }}>
                Create your account
            </Text>
            <Flex direction="column" gap={4} color="gray.900" boxSize={{ base: "100%", lg: "360px" }}>
                <FormControl >
                    <FormLabel htmlFor='name' fontSize={{ base: '14', lg: '16' }}>Name</FormLabel>
                    <Input id='name' name='name' type='text' placeholder='Enter your name' style={InputStyles} />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor='email' fontSize={{ base: '14', lg: '16' }}>Email</FormLabel>
                    <Input id='email' name='email' type='email' placeholder='Enter your email' style={InputStyles} />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor='username' fontSize={{ base: '14', lg: '16' }}>Username</FormLabel>
                    <Input id='username' name='username' type='text' placeholder='Enter your username' style={InputStyles} />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor='password' fontSize={{ base: '14', lg: '16' }}>Password</FormLabel>
                    <Input id='password' name='password' type='password' placeholder='Enter your password' style={InputStyles} />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor='confirm_password' fontSize={{ base: '14', lg: '16' }}>Confirm Password</FormLabel>
                    <Input id='confirm_password' name='confirm_password' type='password' placeholder='Confirm your Password' style={InputStyles} />
                </FormControl>

                <Button variant="primary" w="100%" lineHeight={2} mt="10px">Create Account</Button>
                <Box position='relative' padding='5'>
                    <Divider />
                    <AbsoluteCenter bg="white" color="gray.400" fontWeight="normal">
                        or
                    </AbsoluteCenter>
                </Box>
                <Button variant="secondary" w="100%" mt="10px" lineHeight={2} leftIcon={<FcGoogle />}> Signin with Google </Button>
                <Text textAlign="center" mt="10px" fontFamily="IBM Plex Sans">
                    Already have an account? <Link color='teal.500' href='/signin'> Login </Link>
                </Text>
            </Flex>
        </Flex>
    )
}

export default SignUpForm