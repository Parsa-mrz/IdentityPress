<?php //phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
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
 * Plugin Name:       Identity Press
 * Plugin URI:        https://parsamirzaie.com
 * Description:       A customizable and secure login management plugin for WordPress.
 * License:           GPL-2.0-or-later
 * Version:           1.0.0
 * Author:            Parsa Mirzaie
 * Author URI:        https://parsamirzaie.com
 * Text Domain:       identity-press
 * Domain Path:       /languages
 */

use App\Backend\Core;

if ( ! defined( 'WPINC' ) ) {
	die;
}


if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require __DIR__ . '/vendor/autoload.php';
}


/**
 * The main plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * @since      1.0.0
 * @package    IdentityPress
 */
class IdentityPress {

	/**
	 * The single instance of the class.
	 *
	 * @var IdentityPress|null
	 */
	private static ?IdentityPress $instance = null;

	/**
	 * Retrieve the single instance of the class.
	 *
	 * @since 1.0.0
	 *
	 * @return IdentityPress
	 */
	public static function get_instance(): IdentityPress {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 *
	 * Initializes plugin constants, registers WordPress lifecycle hooks,
	 * and binds the `boot()` method to the `plugins_loaded` action.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->define_constant();
		register_activation_hook( __FILE__, array( $this, 'identity_press_activate' ) );
		register_deactivation_hook( __FILE__, array( $this, 'identity_press_deactivate' ) );
		add_action( 'plugins_loaded', array( $this, 'boot' ) );
	}

	/**
	 * Defines core plugin constants.
	 *
	 * These constants are used throughout the plugin for path and version references.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function define_constant() {
		$plugin_data = get_file_data( __FILE__, array( 'Version' => 'Version' ) );
		define( 'IDENTITY_PRESS_VERSION', $plugin_data['Version'] );
		define( 'IDENTITY_PRESS_PLUGIN_DIR', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
		define( 'IDENTITY_PRESS_PLUGIN_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
		define( 'IDENTITY_PRESS_PLUGIN_FILE', __FILE__ );
	}

	/**
	 * The code that runs during plugin activation.
	 * This action is documented in Includes/Activator.php
	 */
	public function identity_press_activate() {
	}
	/**
	 * The code that runs during plugin deactivation.
	 * This action is documented in Includes/Deactivator.php
	 */
	public function identity_press_deactivate() {
	}

	/**
	 * Boot the core of the plugin.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function boot(): void {
		Core::get_instance()->run();
	}
}

IdentityPress::get_instance();
