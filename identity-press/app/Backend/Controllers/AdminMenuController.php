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
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
	}

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

	public function admin_page_callback() {
		printf(
			'<div class="wrap" id="identity-press-admin-root">%s</div>',
			esc_html__( 'Loading…', 'identity-press' )
		);
	}
}
