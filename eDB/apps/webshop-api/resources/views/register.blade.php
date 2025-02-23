<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Register</title>
        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
        <!-- Styles -->
        <style>
            .register-form {
                border: 1px solid black;
                display: flex;
            }
        </style>
    </head>
    <body class="antialiased">
        <main class="form-container">
        <section class="register-form">
            <form action="" method="get" class="register-form">
                <section class="form-wrapper">
                    <div class="form-group">
                        <label for="user_name">Username</label>
                        <input type="text" name="user_name" id="user_name" value="" placeholder="Username" />
                    </div>
                    <div class="form-group">
                        <label for="first_name">First name</label>
                        <input type="text" name="first_name" id="first_name" value="" placeholder="Elias" />
                    </div>
                    <div class="form-group">
                        <label for="last_name">Last name</label>
                        <input type="text" name="last_name" id="last_name" value="" placeholder="De Bock" />
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" name="password" id="password" value="" placeholder="Password" />
                    </div>
                    <div class="form-group">
                        <label for="phone_number">Phone number</label>
                        <input type="number" name="phone_number id="phone_number" value="" placeholder="04795/77.76.72" />
                    </div>
                    <div class="form-group">
                        <label for="address">Address</label>
                        <input type="text" name="address" id="address" value="" placeholder="Lijnendraaierstraat 13" />
                    </div>
                    <div class="form-group">
                        <label for="postal_code">Postal code</label>
                        <input type="text" name="postal_code" id="postal_code" value="" placeholder="9900" />
                    </div>
                    <div class="form-group">
                        <label for="city">City</label>
                        <input type="text" name="city" id="city" value="" placeholder="Eeklo" />
                    </div>
                </section>

                <section class="submit-btn-container">
                    <input type="submit" value="Register" />
                </section>

            </form>
        </section>
        </main>
    </body>
</html>
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "yo";
}
