//     private static (string Hash, string Salt) HashPassword(string password)
//     {
//       byte[] saltBytes = RandomNumberGenerator.GetBytes(16); // Generate a 128-bit salt
//       string salt = Convert.ToBase64String(saltBytes);

//       string saltedPassword = salt + password; // Combine salt and password

//       byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(saltedPassword)); // Hash the salted password
//       string hash = Convert.ToBase64String(hashBytes);

//       return (hash, salt);
//     }

//     private static readonly string[] items = ["en", "fr", "de", "es"];

//     private static List<User> GenerateUsers(int count)
//     {
//       var faker = new Faker();
//       var users = new List<User>();

//       for (int i = 1; i <= count; i++)
//       {
//         var (hashedPassword, salt) = HashPassword("password" + i);

//         users.Add(
//           new User
//           {
//             Email = faker.Internet.Email(),
//             PasswordHash = hashedPassword,
//             Salt = salt,
//             FirstName = faker.Name.FirstName(),
//             LastName = faker.Name.LastName(),
//             Country = faker.Address.Country(),
//             State = faker.Address.State(),
//             Company = faker.Company.CompanyName(),
//             DisplayName = faker.Name.FullName(),
//             PreferredLanguage = faker.PickRandom(items),
//             Title = faker.Name.JobTitle(),
//             Address = faker.Address.FullAddress(),
//             Role =
//               i % 10 == 0 ? UserRole.Admin : (i % 5 == 0 ? UserRole.PremiumUser : UserRole.User),
//           }
//         );
//       }

//       return users;
//     }

//     private static List<Subscription> GenerateSubscriptions(MyDbContext context, int count)
//     {
//       var faker = new Faker();
//       var subscriptions = new List<Subscription>();

//       // Get all users except the admin
//       var userIds = context
//         .Users.Where(u => u.Email != "admin@example.com")
//         .Select(u => u.Id)
//         .ToList();

//       // Get all applications
//       var applicationIds = context.Applications.Select(a => a.Id).ToList();

//       for (int i = 0; i < count; i++)
//       {
//         var userId = faker.PickRandom(userIds);
//         var applicationId = faker.PickRandom(applicationIds);

//         // Avoid duplicate subscriptions
//         if (!subscriptions.Any(s => s.UserId == userId && s.ApplicationId == applicationId))
//         {
//           subscriptions.Add(
//             new Subscription
//             {
//               UserId = userId,
//               ApplicationId = applicationId,
//               SubscriptionDate = faker.Date.Past(1).ToUniversalTime(), // Random date within the past year
//             }
//           );
//         }
//       }

//       return subscriptions;
//     }
//   }
