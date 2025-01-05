# DevTinder-Api

## authAPI
-POST/profile
-POST/login
-POST/logout

## ProfileRouter
-GET/Profile/view
-PATCH/Profile/edit
-PATCH/Profile/password

## connectionRequsetRouter
-POST/request/sent/intereted/:userId
-POST/request/sent/ignored/:userId
-POST/request/review/accepted/:requestId
-POST/request/review/rejected/:requestId

## userRouter
-GET/user/connection
-GET/user/requests
-GET/user/feed -Gets you the profiles of other users on platform

status: ignore, interested,accepted,rejected