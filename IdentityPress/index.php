<?php
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @since             1.0.0
 * @package        IdentityPress
 *
 * @wordpress-plugin
 * Plugin Name:       IdentityPress
 * Plugin URI:        https://parsamirzaie.com
 * Description:       Automatically sync and update WooCommerce product from external sources.
 * Version:           1.0.0
 * Author:            Parsa Mirzaie
 * Author URI:        https://parsamirzaie.com
 * Text Domain:       identitypress
 * Domain Path:       /languages
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}


/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'IDENTITY_PRESS_PLUGIN_DIR', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'IDENTITY_PRESS_PLUGIN_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'IDENTITY_PRESS_PLUGIN_FILE', __FILE__ );


/**
 * The code that runs during plugin activation.
 * This action is documented in Includes/Activator.php
 */
function activate() {
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in Includes/Deactivator.php
 */
function deactivate() {
}

register_activation_hook( __FILE__, 'activate' );
register_deactivation_hook( __FILE__, 'deactivate' );
