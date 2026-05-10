<?php //phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
namespace App\Backend\Controllers;

/**
 * The core functionality of the plugin.
 *
 * @link       https://parsamirzaie.com
 * @since      1.0.0
 * @package    IdentityPress
 * @subpackage App\Backend\Controllers
 */
class AdminMenuController {
	/**
	 * Initialize the class and register admin hooks.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
	}

	/**
	 * Add the top-level admin menu for the plugin.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function add_admin_menu() {
		add_menu_page(
			__( 'Identity Press', 'identity-press' ),
			__( 'Identity Press', 'identity-press' ),
			'manage_options',
			'identity-press',
			array( $this, 'admin_page_callback' ),
			'dashicons-admin-users',
			56
		);
	}

	/**
	 * Callback for the admin page to render the React root element.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function admin_page_callback() {
		printf(
			'<div class="wrap" id="identity-press-admin-root">%s</div>',
			esc_html__( 'Loading…', 'identity-press' )
		);
	}
}
