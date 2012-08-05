redirect_users
==============

Simple Drupal 7 module to redirect specific users to specific pages from one URL.

With this module you can define a URL (that doesn't already exist in your Drupal install), and then using autocomplete, specify users and the URL they should be redirected to when they visit that URL.

This is useful for when you have user specific content but wish to supply one URL to all users, i.e. in print material, an email or in content within your Drupal website.

EXAMPLE
=======

Say you want to provide a URL such as http://yoursite.com/foo and want UserA to be redirected to http://yoursite.com/foo-a and UserB to be redirected to http://yoursite.com/foo-b
The path /foo doesn't already exist, but /foo-a and /foo-b are nodes.

1. Enter a URL such as 'foo' as the 'From URL'
2. Use the autocomplete fields to find and select user 'UserA' and node 'Foo A'
3. Use the autocomplete fields to find and select user 'UserB' and node 'Foo B'
4. Save :)

CREDITS
=======
Link autocomplete javascript comes from dcoulombe's module here: http://drupal.org/node/1370926#comment-6218658