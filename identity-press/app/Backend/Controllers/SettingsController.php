<?php //phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
namespace App\Backend\Controllers;

use App\Backend\Repositories\SettingsRepository;
use App\Backend\Actions\UpdateSettingsAction;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

defined( 'ABSPATH' ) || exit;

/**
 * REST API Controller for managing plugin settings.
 *
 * @since      1.0.0
 * @package    IdentityPress
 * @subpackage App\Backend\Controllers
 */
class SettingsController {
	/**
	 * The settings repository instance.
	 *
	 * @var SettingsRepository
	 */
	private $repository;

	/**
	 * The update settings action instance.
	 *
	 * @var UpdateSettingsAction
	 */
	private $update_action;

	/**
	 * Initialize the class and register REST hooks.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->repository    = new SettingsRepository();
		$this->update_action = new UpdateSettingsAction();
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register the REST API routes.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			'identity-press/v1',
			'/settings',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_settings' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);

		register_rest_route(
			'identity-press/v1',
			'/settings/(?P<group>[a-zA-Z0-9-]+)',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'update_settings' ),
				'permission_callback' => array( $this, 'check_permission' ),
			)
		);
	}

	/**
	 * Check if the current user has permission to manage settings.
	 *
	 * @return bool
	 */
	public function check_permission(): bool {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Get all settings.
	 *
	 * @return WP_REST_Response
	 */
	public function get_settings(): WP_REST_Response {
		return new WP_REST_Response( $this->repository->get_all(), 200 );
	}

	/**
	 * Update settings for a specific group.
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function update_settings( WP_REST_Request $request ) {
		$group = $request->get_param( 'group' );
		$data  = $request->get_json_params();

		if ( $this->update_action->execute( $group, $data ) ) {
			return new WP_REST_Response( array( 'success' => true ), 200 );
		}

		return new WP_Error( 'save_failed', __( 'Failed to save settings.', 'identity-press' ), array( 'status' => 500 ) );
	}
}
