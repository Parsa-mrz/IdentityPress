<?php //phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
namespace App\Backend\DTOs;

defined( 'ABSPATH' ) || exit;

/**
 * Data Transfer Object for plugin settings.
 *
 * @since      1.0.0
 * @package    IdentityPress
 * @subpackage App\Backend\DTOs
 */
class SettingsDTO {
	/**
	 * General settings data.
	 *
	 * @var array
	 */
	public array $general;

	/**
	 * SMS gateway settings data.
	 *
	 * @var array
	 */
	public array $gateways;

	/**
	 * Visual styling settings data.
	 *
	 * @var array
	 */
	public array $style;

	/**
	 * SettingsDTO constructor.
	 *
	 * @param array $data Raw settings data from the request.
	 */
	public function __construct( array $data ) {
		$this->general  = $data['general'] ?? array();
		$this->gateways = $data['gateways'] ?? array();
		$this->style    = $data['style'] ?? array();
	}

	/**
	 * Convert the DTO to an array.
	 *
	 * @return array
	 */
	public function to_array(): array {
		return array(
			'general'  => $this->general,
			'gateways' => $this->gateways,
			'style'    => $this->style,
		);
	}
}
