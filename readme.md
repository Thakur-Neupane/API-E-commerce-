# Login registration Workflow

### The work flow below explaining the steps how to build robust user registration process step by step.

## Step 1 creating user and sending verification link to users

1. FE:: Send user form to backend
2. BE:: receive user and do the followings:
   -- get the password and encrypt
   --create uniques code and store it in the session table with e-mail
   -- format url like `http://yourdomain.com/verify-user?c=ewrsdtfyughi12345e=user@email.com`
   --send the above link to user email
3. BE:: Insert user in the user table
4. BE:: response user saying check their email to verify the account.

## step 2 For user , opening email and following instruction to click the link received.

1. FE:: User clicks on the link in their email and redirected to our webpage `http://yourdomain.com/verify-user?c=ewrsdtfyughi12345e=user@email.com`

2. FE:: Within our ` verify-user` page, receive the `c ` & `e` from the query string

3. FE:: send the `c` & `e` to the server to verify

4. BE:: create new api endpoint to receive the `{c, e}`

5. BE:: verify `{c, e}` is exist in the session table and validate
   --Delete the data from the session table
   -- if valid, update user status to active and also `is EmailVerified: true`
   -- then, send email notifying the account has been activated and they can sign in now.
   -- response user the same
   --Else, the link is invalid
