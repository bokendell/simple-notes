import React from "react";

const Footer = () => {
	return (
		<footer className="fixed-bottom bg-light text-center text-lg-start">
			<div
				className="text-center p-3"
				style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
			>
				<p className="my-1">
					SimpleNotes is not currently being funded so the
					transcriptions will not work at the moment.
				</p>
				<p className="my-1">
					Find out more about my work{" "}
					<a
						href="https://bokendell.me"
						target="_blank"
						rel="noopener noreferrer"
					>
						here
					</a>
					.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
